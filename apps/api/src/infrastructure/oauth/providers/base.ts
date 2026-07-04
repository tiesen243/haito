// oxlint-disable class-methods-use-this, typescript/no-this-alias, unicorn/no-this-assignment
import * as Effect from 'effect/Effect'

import type { OAuthService } from '@/application/services/oauth.service'
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
  ): Effect.Effect<URL, never, never>

  public abstract fetchUserData(
    code: string,
    codeVerifier: string
  ): Effect.Effect<OAuthService.User, HttpError, never>

  protected createCallbackUrl() {
    let baseUrl = `http://localhost:${process.env.PORT ?? 3000}`
    if (process.env.APP_URL) baseUrl = `https://${process.env.APP_URL}`
    else if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
      baseUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`

    return `${baseUrl}/api/auth/${this.providerName}/callback`
  }

  protected createAuthorizationUrlWithoutPkce(
    endpoint: string,
    state: string,
    scopes: string[]
  ): Effect.Effect<URL, never, never> {
    const self = this

    return Effect.gen(function* createAuthorizationUrlWithoutPkceFunc() {
      const url = new URL(endpoint)
      url.searchParams.set('response_type', 'code')
      url.searchParams.set('client_id', self.clientId)
      url.searchParams.set('state', state)

      if (scopes.length > 0) url.searchParams.set('scope', scopes.join(' '))
      url.searchParams.set('redirect_uri', self.redirectUri)

      return yield* Effect.succeed(url)
    })
  }

  protected createAuthorizationUrlWithPKCE(
    endpoint: string,
    state: string,
    scopes: string[],
    codeVerifier: string,
    codeChallengeMethod: 'S256' | 'plain' = 'S256'
  ): Effect.Effect<URL, never, never> {
    const self = this

    return Effect.gen(function* createAuthorizationUrlWithPKCEFunc() {
      const url = yield* self.createAuthorizationUrlWithoutPkce(
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
  ): Effect.Effect<OAuthService.Token, HttpError, never> {
    const self = this

    return Effect.gen(function* validateAuthorizationCodeFunc() {
      const body = new URLSearchParams()
      body.set('grant_type', 'authorization_code')
      body.set('redirect_uri', self.redirectUri)
      body.set('client_id', self.clientId)
      body.set('code', code)

      if (codeVerifier) body.set('code_verifier', codeVerifier)

      const request = self.createRequest(endpoint, body)
      request.headers.set(
        'Authorization',
        `Basic ${self.encodeCredentials(self.clientId, self.clientSecret)}`
      )

      return yield* effetch<OAuthService.Token>(request)
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
