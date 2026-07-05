import * as Effect from 'effect/Effect'

import type { OAuthService } from '@/application/services/oauth.service'
import type { HttpError } from '@/shared/http-error'

import { BaseProvider } from '@/infrastructure/oauth/providers/base.provider'
import { effetch } from '@/shared/lib/effetch'

export class VercelProvider extends BaseProvider {
  public constructor(clientId: string, clientSecret: string, redirectUri = '') {
    super('vercel', clientId, clientSecret, redirectUri)
  }

  private authorizationEndpoint = 'https://vercel.com/oauth/authorize'
  private tokenEndpoint = 'https://api.vercel.com/login/oauth/token'
  private apiEndpoint = 'https://api.vercel.com/login/oauth/userinfo'

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

      const user = yield* effetch<VercelUserResponse>(self.apiEndpoint, {
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

interface VercelUserResponse {
  sub: string
  name: string
  email: string
  picture: string
  preferred_username: string
}
