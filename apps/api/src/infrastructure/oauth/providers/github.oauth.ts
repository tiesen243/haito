import * as Effect from 'effect/Effect'

import type { OAuthService } from '@/application/services/oauth.service'

import {
  createAuthorizationUrlWithPKCE,
  validateAuthorizationCode,
} from '@/infrastructure/oauth/lib/core'
import { HttpError } from '@/shared/http-error'
import { env } from '@/shared/lib/env'

const AUTHORIZATION_ENDPOINT = 'https://github.com/login/oauth/authorize'
const TOKEN_ENDPOINT = 'https://github.com/login/oauth/access_token'
const API_ENDPOINT = 'https://api.github.com/user'
const CALLBACK_URL = `${env.API_URL}/api/auth/github/callback`

export const GithubOAuth = {
  createAuthorizationUrl: (
    state: string,
    codeVerifier: string
  ): Effect.Effect<URL, never, never> =>
    createAuthorizationUrlWithPKCE(
      AUTHORIZATION_ENDPOINT,
      env.AUTH_GITHUB_ID,
      state,
      ['read:user', 'user:email'],
      CALLBACK_URL,
      codeVerifier
    ),

  fetchUserData: (
    code: string,
    codeVerifier: string
  ): Effect.Effect<OAuthService.User, HttpError, never> =>
    Effect.gen(function* fetchUserDataFunc() {
      const tokenRes = yield* validateAuthorizationCode(
        TOKEN_ENDPOINT,
        env.AUTH_GOOGLE_ID,
        env.AUTH_GOOGLE_SECRET,
        CALLBACK_URL,
        code,
        codeVerifier
      )

      const userRes = yield* Effect.tryPromise({
        try: () =>
          fetch(API_ENDPOINT, {
            headers: { Authorization: `Bearer ${tokenRes.access_token}` },
          }).then((res) => res.json() as Promise<GithubUserResponse>),
        catch: (error) =>
          HttpError.internalServerError(
            'Failed to fetch user data from GitHub API',
            error
          ),
      })

      return {
        id: userRes.id,
        name: userRes.name,
        email: userRes.email,
        image: userRes.avatar_url,
      }
    }),
} satisfies OAuthService.Provider

interface GithubUserResponse {
  id: string
  name: string
  email: string
  avatar_url: string
}
