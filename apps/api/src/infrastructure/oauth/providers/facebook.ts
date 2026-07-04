import * as Effect from 'effect/Effect'

import type { OAuthService } from '@/application/services/oauth.service'
import type { HttpError } from '@/shared/http-error'

import { BaseProvider } from '@/infrastructure/oauth/providers/base'
import { effetch } from '@/shared/lib/effetch'

export class Facebook extends BaseProvider {
  public constructor(clientId: string, clientSecret: string, redirectUri = '') {
    super('facebook', clientId, clientSecret, redirectUri)
  }

  private authorizationEndpoint = 'https://www.facebook.com/v23.0/dialog/oauth'
  private tokenEndpoint = 'https://graph.facebook.com/v23.0/oauth/access_token'
  private apiEndpoint = 'https://graph.facebook.com/me'

  public override createAuthorizationUrl(
    state: string,
    _codeVerifier: string
  ): Effect.Effect<URL, never, never> {
    return this.createAuthorizationUrlWithoutPkce(
      this.authorizationEndpoint,
      state,
      ['email', 'public_profile']
    )
  }

  public override fetchUserData(
    code: string,
    _codeVerifier: string
  ): Effect.Effect<OAuthService.User, HttpError, never> {
    // oxlint-disable-next-line typescript/no-this-alias unicorn/no-this-assignment
    const self = this

    return Effect.gen(function* fetchUserDataFunc() {
      const tokens = yield* self.validateAuthorizationCode(
        self.tokenEndpoint,
        code
      )

      const searchParams = new URLSearchParams()
      searchParams.set('access_token', tokens.access_token)
      searchParams.set('fields', ['id', 'name', 'picture', 'email'].join(','))

      const user = yield* effetch<FacebookUserResponse>(
        `${self.apiEndpoint}?${searchParams.toString()}`
      )

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.picture.data.url,
      }
    })
  }
}

interface FacebookUserResponse {
  id: string
  name: string
  email: string
  picture: { data: { url: string } }
}
