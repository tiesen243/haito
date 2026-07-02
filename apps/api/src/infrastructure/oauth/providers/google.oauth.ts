import * as Effect from 'effect/Effect'

import type { OAuthService } from '@/application/services/oauth.service'

import {
  createAuthorizationUrlWithPKCE,
  validateAuthorizationCode,
} from '@/infrastructure/oauth/lib/core'
import { HttpError } from '@/shared/http-error'
import { env } from '@/shared/lib/env'

const AUTHORIZATION_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth'
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
const API_ENDPOINT = 'https://openidconnect.googleapis.com/v1/userinfo'
const CALLBACK_URL = `${env.API_URL}/api/auth/google/callback`

export const GoogleOAuth = {
  createAuthorizationUrl: (
    state: string,
    codeVerifier: string
  ): Effect.Effect<URL, never, never> =>
    createAuthorizationUrlWithPKCE(
      AUTHORIZATION_ENDPOINT,
      env.AUTH_GOOGLE_ID,
      state,
      ['openid', 'profile', 'email'],
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
          }).then((res) => res.json() as Promise<GoogleUserResponse>),
        catch: (error) =>
          HttpError.internalServerError(
            'Failed to fetch user data from Google API',
            error
          ),
      })

      return {
        id: userRes.sub,
        name: userRes.name,
        email: userRes.email,
        image: userRes.picture,
      }
    }),
} satisfies OAuthService.Provider

interface GoogleUserResponse {
  sub: string
  name: string
  email: string
  picture: string
}
