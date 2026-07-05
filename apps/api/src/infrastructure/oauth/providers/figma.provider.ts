import * as Effect from 'effect/Effect'

import type { OAuthService } from '@/application/services/oauth.service'
import type { HttpError } from '@/shared/http-error'

import { BaseProvider } from '@/infrastructure/oauth/providers/base.provider'
import { effetch } from '@/shared/lib/effetch'

export class FigmaProvider extends BaseProvider {
  public constructor(clientId: string, clientSecret: string, redirectUri = '') {
    super('figma', clientId, clientSecret, redirectUri)
  }

  private authorizationEndpoint = 'https://www.figma.com/oauth'
  private tokenEndpoint = 'https://api.figma.com/v1/oauth/token'
  private apiEndpoint = 'https://api.figma.com/v1/me'

  public override createAuthorizationUrl(
    state: string,
    codeVerifier: string
  ): Effect.Effect<URL, never, never> {
    return this.createAuthorizationUrlWithPKCE(
      this.authorizationEndpoint,
      state,
      ['current_user:read'],
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

      const user = yield* effetch<FigmaUserResponse>(self.apiEndpoint, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      })

      return {
        id: user.id,
        name: user.handle,
        email: user.email,
        image: user.img_url,
      }
    })
  }
}

interface FigmaUserResponse {
  id: string
  handle: string
  email: string
  img_url: string
}
