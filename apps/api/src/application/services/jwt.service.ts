import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import crypto from 'node:crypto'

import type { AppModule } from '@/app.module'

import { decodeBase64Url, encodeBase64Url } from '@/shared/lib/crypto'

export interface JWTOptions {
  headers?: Record<string, unknown>
  expiresIn?: number
  issuer?: string
  subject?: string
  audiences?: string | string[]
  notBefore?: Date
  includeIssuedTimestamp?: boolean
  jwtId?: string
}

export interface JWTHeader {
  exp: number
  aud?: string | string[]
  iat?: number
  iss?: string
  jti?: string
  nbf?: number
  sub?: string
  [key: string]: unknown
}

export class JWT extends Context.Tag('JWT')<
  JWT,
  {
    readonly sign: (
      payloadClaims: Record<string, unknown>,
      options?: JWTOptions
    ) => Effect.Effect<string, never, never>

    readonly verify: (token: string) => Effect.Effect<JWTHeader, Error, never>
  }
>() {
  public static live = (config: AppModule.Config['jwt']) => {
    const signData = (
      data: Uint8Array
    ): Effect.Effect<ArrayBuffer, never, never> =>
      Effect.gen(function* signDataFunc() {
        const algMap = {
          HS256: { name: 'SHA-256' },
          HS384: { name: 'SHA-384' },
          HS512: { name: 'SHA-512' },
        } as const

        const key = yield* Effect.promise(() =>
          crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(config.secret),
            { name: 'HMAC', hash: algMap[config.algorithm] },
            false,
            ['sign']
          )
        )

        return yield* Effect.promise(() =>
          crypto.subtle.sign('HMAC', key, data as Uint8Array<ArrayBuffer>)
        )
      })

    return Layer.succeed(JWT, {
      sign: (
        payloadClaims: Record<string, unknown>,
        options: JWTOptions = {}
      ) =>
        Effect.gen(function* signFunc() {
          const header = {
            ...options.headers,
            alg: config.algorithm,
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
          const signature = yield* signData(data)
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

          const expectedSignature = yield* signData(data)

          const expectedSignaturePart = encodeBase64Url(
            new Uint8Array(expectedSignature)
          )
          if (expectedSignaturePart !== signaturePart)
            throw new Error('Invalid token signature')

          const payloadJson = new TextDecoder().decode(
            decodeBase64Url(payloadPart)
          )
          const headerJson = new TextDecoder().decode(
            decodeBase64Url(headerPart)
          )

          const payload = JSON.parse(payloadJson) as JWTHeader
          const header = JSON.parse(headerJson) as Record<string, unknown>

          const currentTime = Math.floor(Date.now() / 1000)
          if (payload.exp && currentTime >= payload.exp)
            throw new Error('Token has expired')
          if (payload.nbf && currentTime < payload.nbf)
            throw new Error('Token not valid yet')

          return { ...payload, ...header }
        }),
    })
  }
}
