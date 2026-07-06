// oxlint-disable class-methods-use-this

import * as Effect from 'effect/Effect'

import type { InfrastructureOAuthModule } from '@/infrastructure/oauth/oauth.module'
import type { HttpError } from '@/shared/http-error'

import { generateCodeChallenge } from '@/shared/lib/crypto'
import { effetch } from '@/shared/lib/effetch'

export abstract class BaseProvider {
  protected constructor(
    public readonly providerName: string,
    protected readonly clientId: string,
    protected readonly clientSecret: string,
    protected readonly redirectUri: string
  ) {
    if (!this.redirectUri) this.redirectUri = this.createCallbackUrl()
  }

  public abstract createAuthorizationUrl(
    state: string,
    codeVerifier: string
  ): Effect.Effect<URL, unknown, never>

  public abstract fetchUserData(
    code: string,
    codeVerifier: string
  ): Effect.Effect<InfrastructureOAuthModule.User, unknown, never>

  protected createCallbackUrl() {
    let baseUrl = `http://localhost:${process.env.PORT ?? 3000}`
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
      baseUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    else if (process.env.VERCEL_URL)
      baseUrl = `https://${process.env.VERCEL_URL}`

    return `${baseUrl}/api/auth/${this.providerName}/callback`
  }

  protected createAuthorizationUrlWithoutPKCE(
    endpoint: string,
    state: string,
    scopes: string[]
  ): Effect.Effect<URL, never, never> {
    return Effect.gen(this, function* createAuthorizationUrlWithoutPKCEFunc() {
      const url = new URL(endpoint)
      url.searchParams.set('response_type', 'code')
      url.searchParams.set('client_id', this.clientId)
      url.searchParams.set('state', state)

      if (scopes.length > 0) url.searchParams.set('scope', scopes.join(' '))
      url.searchParams.set('redirect_uri', this.redirectUri)

      return yield* Effect.succeed(url)
    })
  }

  protected createAuthorizationUrlWithPKCE(
    endpoint: string,
    state: string,
    scopes: string[],
    codeVerifier: string,
    codeChallengeMethod: 'S256' | 'plain' = 'S256'
  ): Effect.Effect<URL> {
    return Effect.gen(this, function* createAuthorizationUrlWithPKCEFunc() {
      const url = yield* this.createAuthorizationUrlWithoutPKCE(
        endpoint,
        state,
        scopes
      )

      if (codeChallengeMethod === 'S256') {
        const codeChallenge = yield* generateCodeChallenge(codeVerifier)
        url.searchParams.set('code_challenge', codeChallenge)
        url.searchParams.set('code_challenge_method', 'S256')
      } else {
        url.searchParams.set('code_challenge', codeVerifier)
        url.searchParams.set('code_challenge_method', 'plain')
      }

      return url
    })
  }

  protected validateAuthorizationCode(
    endpoint: string,
    code: string,
    codeVerifier: string | null = null
  ): Effect.Effect<InfrastructureOAuthModule.Token, HttpError, never> {
    return Effect.gen(this, function* validateAuthorizationCodeFunc() {
      const body = new URLSearchParams()
      body.set('grant_type', 'authorization_code')
      body.set('redirect_uri', this.redirectUri)
      body.set('client_id', this.clientId)
      body.set('code', code)

      if (codeVerifier) body.set('code_verifier', codeVerifier)

      const request = this.createRequest(endpoint, body)

      const credentials = this.encodeCredentials(
        this.clientId,
        this.clientSecret
      )
      request.headers.set('Authorization', `Basic ${credentials}`)

      return yield* effetch<InfrastructureOAuthModule.Token>(request)
    })
  }

  private createRequest(enpoint: string, body: URLSearchParams) {
    const bodyBytes = new TextEncoder().encode(body.toString())
    const request = new Request(enpoint, { method: 'POST', body: bodyBytes })

    request.headers.set('Content-Type', 'application/x-www-form-urlencoded')
    request.headers.set('Accept', 'application/json')
    request.headers.set('User-Agent', 'yuki-auth')
    request.headers.set('Content-Length', bodyBytes.byteLength.toString())

    return request
  }

  private encodeCredentials(clientId: string, clientSecret: string): string {
    const credentials = `${clientId}:${clientSecret}`
    const bytes = new TextEncoder().encode(credentials)
    return btoa(String.fromCodePoint(...bytes))
      .replaceAll('+', '-')
      .replaceAll('/', '_')
      .replaceAll(/[=]/g, '')
  }
}
