import * as Effect from 'effect/Effect'

import type { OAuthService } from '@/application/services/oauth.service'
import type { HttpError } from '@/shared/http-error'

import { BaseProvider } from '@/infrastructure/oauth/providers/base'
import { effetch } from '@/shared/lib/effetch'

export class Google extends BaseProvider {
  public constructor(clientId: string, clientSecret: string, redirectUri = '') {
    super('google', clientId, clientSecret, redirectUri)
  }

  private authorizationEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth'
  private tokenEndpoint = 'https://oauth2.googleapis.com/token'
  private apiEndpoint = 'https://openidconnect.googleapis.com/v1/userinfo'

  public override createAuthorizationUrl(
    state: string,
    codeVerifier: string
  ): Effect.Effect<URL, never, never> {
    return this.createAuthorizationUrlWithPKCE(
      this.authorizationEndpoint,
      state,
      ['openid', 'email', 'profile'],
      codeVerifier
    )
  }

  public override fetchUserData(
    code: string,
    codeVerifier: string
  ): Effect.Effect<OAuthService.User, HttpError, never> {
    // oxlint-disable-next-line typescript/no-this-alias unicorn/no-this-assignment
    const self = this

    return Effect.gen(function* fetchUserDataFunc() {
      const tokens = yield* self.validateAuthorizationCode(
        self.tokenEndpoint,
        code,
        codeVerifier
      )

      const user = yield* effetch<GoogleUserResponse>(self.apiEndpoint, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      })

      return {
        id: user.sub,
        name: user.name,
        email: user.email,
        image: user.picture,
      }
    })
  }
}

interface GoogleUserResponse {
  sub: string
  name: string
  email: string
  picture: string
}
