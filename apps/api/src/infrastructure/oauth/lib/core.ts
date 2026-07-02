import * as Effect from 'effect/Effect'

import type { OAuthService } from '@/application/services/oauth.service'

import { generateCodeChallenge } from '@/infrastructure/oauth/lib/crypto'
import { HttpError } from '@/shared/http-error'

export const createAuthorizationUrlWithoutPkce = (
  endpoint: string,
  clientId: string,
  state: string,
  scopes: string[],
  redirectUri: string
): Effect.Effect<URL, never, never> =>
  Effect.gen(function* createAuthorizationUrlWithoutPkceFunc() {
    const url = new URL(endpoint)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('client_id', clientId)
    url.searchParams.set('state', state)

    if (scopes.length > 0) url.searchParams.set('scope', scopes.join(' '))
    url.searchParams.set('redirect_uri', redirectUri)

    return yield* Effect.succeed(url)
  })

export const createAuthorizationUrlWithPKCE = (
  endpoint: string,
  clientId: string,
  state: string,
  scopes: string[],
  redirectUri: string,
  codeVerifier: string,
  codeChallengeMethod: 'S256' | 'plain' = 'S256'
): Effect.Effect<URL, never, never> =>
  Effect.gen(function* createAuthorizationUrlWithPKCEFunc() {
    const url = yield* createAuthorizationUrlWithoutPkce(
      endpoint,
      clientId,
      state,
      scopes,
      redirectUri
    )

    if (codeChallengeMethod === 'S256') {
      const codeChallenge = yield* Effect.promise(() =>
        generateCodeChallenge(codeVerifier)
      )
      url.searchParams.set('code_challenge', codeChallenge)
      url.searchParams.set('code_challenge_method', 'S256')
    } else {
      url.searchParams.set('code_challenge', codeVerifier)
      url.searchParams.set('code_challenge_method', 'plain')
    }

    return url
  })

export const validateAuthorizationCode = (
  endpoint: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  code: string,
  codeVerifier: string | null = null
): Effect.Effect<OAuthService.Token, HttpError, never> =>
  Effect.gen(function* validateAuthorizationCodeFunc() {
    const body = new URLSearchParams()
    body.set('grant_type', 'authorization_code')
    body.set('redirect_uri', redirectUri)
    body.set('client_id', clientId)
    body.set('code', code)

    if (codeVerifier) body.set('code_verifier', codeVerifier)

    const request = createRequest(endpoint, body)
    request.headers.set(
      'Authorization',
      `Basic ${encodeCredentials(clientId, clientSecret)}`
    )

    return yield* Effect.tryPromise({
      try: () =>
        fetch(request).then((res) => res.json() as Promise<OAuthService.Token>),
      catch: (error) =>
        HttpError.internalServerError(
          'Failed to validate authorization code',
          error
        ),
    })
  })

function createRequest(enpoint: string, body: URLSearchParams) {
  const bodyBytes = new TextEncoder().encode(body.toString())
  const request = new Request(enpoint, { method: 'POST', body: bodyBytes })

  request.headers.set('Content-Type', 'application/x-www-form-urlencoded')
  request.headers.set('Accept', 'application/json')
  request.headers.set('User-Agent', 'yuki-auth')
  request.headers.set('Content-Length', bodyBytes.byteLength.toString())

  return request
}

function encodeCredentials(clientId: string, clientSecret: string): string {
  const credentials = `${clientId}:${clientSecret}`
  const bytes = new TextEncoder().encode(credentials)
  return btoa(String.fromCodePoint(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll(/[=]/g, '')
}
