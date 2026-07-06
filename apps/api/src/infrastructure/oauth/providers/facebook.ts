import * as Effect from 'effect/Effect'

import type { InfrastructureOAuthModule } from '@/infrastructure/oauth/oauth.module'

import { BaseProvider } from '@/infrastructure/oauth/providers/base'
import { effetch } from '@/shared/lib/utils'

export class Facebook extends BaseProvider {
  public constructor(clientId: string, clientSecret: string, redirectUri = '') {
    super('facebook', clientId, clientSecret, redirectUri)
  }

  private authorizationEndpoint = 'https://www.facebook.com/v23.0/dialog/oauth'
  private tokenEndpoint = 'https://graph.facebook.com/v23.0/oauth/access_token'
  private apiEndpoint = 'https://graph.facebook.com/me'

  public override createAuthorizationUrl = (
    state: string,
    _codeVerifier: string
  ): Effect.Effect<URL> =>
    this.createAuthorizationUrlWithoutPKCE(this.authorizationEndpoint, state, [
      'email',
      'public_profile',
    ])

  public override fetchUserData = (
    code: string,
    _codeVerifier: string
  ): Effect.Effect<InfrastructureOAuthModule.User, unknown> =>
    Effect.gen(this, function* fetchUserDataFunc() {
      const token = yield* this.validateAuthorizationCode(
        this.tokenEndpoint,
        code
      )

      const searchParams = new URLSearchParams()
      searchParams.set('access_token', token.access_token)
      searchParams.set('fields', ['id', 'name', 'picture', 'email'].join(','))

      const user = yield* effetch<Facebook.User>(
        `${this.apiEndpoint}?${searchParams.toString()}`
      )

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.picture.data.url,
      }
    })
}

export namespace Facebook {
  export interface User {
    id: string
    name: string
    email: string
    picture: { data: { url: string } }
  }
}
