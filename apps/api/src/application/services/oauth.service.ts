import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'

import type { HttpError } from '@/shared/http-error'

export class OAuthService extends Context.Tag('OAuthService')<
  OAuthService,
  {
    readonly forProvider: (
      provider: string
    ) => Effect.Effect<OAuthService.Provider, HttpError, never>
  }
>() {
  public static forProvider = (provider: string) =>
    Effect.flatMap(this, (s) => s.forProvider(provider))
}

export namespace OAuthService {
  export interface User {
    id: string
    name: string
    email: string
    image: string | null
  }

  export interface Token {
    access_token: string
    token_type: string
    expires_in: number
  }

  export interface Provider {
    readonly createAuthorizationUrl: (
      state: string,
      codeVerifier: string
    ) => Effect.Effect<URL, never, never>

    readonly fetchUserData: (
      code: string,
      codeVerifier: string
    ) => Effect.Effect<OAuthService.User, HttpError, never>
  }
}
