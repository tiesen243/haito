import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import crypto from 'node:crypto'

import { Config } from '@/shared/config'
import { decodeBase64Url, encodeBase64Url } from '@/shared/lib/crypto'

export class JWTService extends Context.Tag('application/service/JWT')<
  JWTService,
  {
    readonly sign: (
      payloadClaims: Record<string, unknown>,
      options?: JWTService.Options
    ) => Effect.Effect<string, never, Config>

    readonly verify: (
      token: string
    ) => Effect.Effect<JWTService.Header, Error, Config>
  }
>() {
  public static live = Layer.succeed(JWTService, {
    sign: (
      payloadClaims: Record<string, unknown>,
      options: JWTService.Options = {}
    ) =>
      Effect.gen(function* signFunc() {
        const config = yield* Config

        const header = {
          ...options.headers,
          alg: config.auth.algorithm ?? 'HS256',
          typ: 'JWT',
        }
        const payload = { ...payloadClaims } as Record<string, unknown>

        if (!payload.exp)
          payload.exp =
            Math.floor(Date.now() / 1000) + (options.expiresIn ?? 3600)
        if (options.audiences) payload.aud = options.audiences
        if (options.subject) payload.sub = options.subject
        if (options.issuer) payload.iss = options.issuer
        if (options.jwtId) payload.jti = options.jwtId
        if (options.notBefore)
          payload.nbf = Math.floor(options.notBefore.getTime() / 1000)
        if (options.includeIssuedTimestamp)
          payload.iat = Math.floor(Date.now() / 1000)

        const textEncoder = new TextEncoder()
        const headerPart = encodeBase64Url(
          textEncoder.encode(JSON.stringify(header))
        )
        const payloadPart = encodeBase64Url(
          textEncoder.encode(JSON.stringify(payload))
        )

        const data = textEncoder.encode(`${headerPart}.${payloadPart}`)
        const signature = yield* JWTService.signData(data)
        const signaturePart = encodeBase64Url(new Uint8Array(signature))

        return `${headerPart}.${payloadPart}.${signaturePart}`
      }),

    verify: (token: string) =>
      Effect.gen(function* verifyFunc() {
        const [headerPart, payloadPart, signaturePart] = token.split('.')
        if (!headerPart || !payloadPart || !signaturePart)
          throw new Error('Invalid token format')

        const textEncoder = new TextEncoder()
        const data = textEncoder.encode(`${headerPart}.${payloadPart}`)

        const expectedSignature = yield* JWTService.signData(data)

        const expectedSignaturePart = encodeBase64Url(
          new Uint8Array(expectedSignature)
        )
        if (expectedSignaturePart !== signaturePart)
          throw new Error('Invalid token signature')

        const payloadJson = new TextDecoder().decode(
          decodeBase64Url(payloadPart)
        )
        const headerJson = new TextDecoder().decode(decodeBase64Url(headerPart))

        const payload = JSON.parse(payloadJson) as JWTService.Header
        const header = JSON.parse(headerJson) as Record<string, unknown>

        const currentTime = Math.floor(Date.now() / 1000)
        if (payload.exp && currentTime >= payload.exp)
          throw new Error('Token has expired')
        if (payload.nbf && currentTime < payload.nbf)
          throw new Error('Token not valid yet')

        return { ...payload, ...header }
      }),
  })

  private static signData = (
    data: Uint8Array
  ): Effect.Effect<ArrayBuffer, never, Config> =>
    Effect.gen(function* signDataFunc() {
      const config = yield* Config

      const algMap = {
        HS256: { name: 'SHA-256' },
        HS384: { name: 'SHA-384' },
        HS512: { name: 'SHA-512' },
      } as const

      const key = yield* Effect.promise(() =>
        crypto.subtle.importKey(
          'raw',
          new TextEncoder().encode(config.auth.secret),
          { name: 'HMAC', hash: algMap[config.auth.algorithm ?? 'HS256'] },
          false,
          ['sign']
        )
      )

      return yield* Effect.promise(() =>
        crypto.subtle.sign('HMAC', key, data as Uint8Array<ArrayBuffer>)
      )
    })
}

export namespace JWTService {
  export interface Options {
    headers?: Record<string, unknown>
    expiresIn?: number
    issuer?: string
    subject?: string
    audiences?: string | string[]
    notBefore?: Date
    includeIssuedTimestamp?: boolean
    jwtId?: string
  }

  export interface Header {
    exp: number
    aud?: string | string[]
    iat?: number
    iss?: string
    jti?: string
    nbf?: number
    sub?: string
    [key: string]: unknown
  }
}
