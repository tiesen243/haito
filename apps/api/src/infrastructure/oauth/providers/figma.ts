import * as Effect from 'effect/Effect'

import type { InfrastructureOAuthModule } from '@/infrastructure/oauth/oauth.module'

import { BaseProvider } from '@/infrastructure/oauth/providers/base'
import { effetch } from '@/shared/lib/effetch'

export class Figma extends BaseProvider {
  public constructor(clientId: string, clientSecret: string, redirectUri = '') {
    super('figma', clientId, clientSecret, redirectUri)
  }

  private authorizationEndpoint = 'https://www.figma.com/oauth'
  private tokenEndpoint = 'https://api.figma.com/v1/oauth/token'
  private apiEndpoint = 'https://api.figma.com/v1/me'

  public override createAuthorizationUrl = (
    state: string,
    codeVerifier: string
  ): Effect.Effect<URL> =>
    this.createAuthorizationUrlWithPKCE(
      this.authorizationEndpoint,
      state,
      ['current_user:read'],
      codeVerifier
    )

  public override fetchUserData = (
    code: string,
    codeVerifier: string
  ): Effect.Effect<InfrastructureOAuthModule.User, unknown> =>
    Effect.gen(this, function* fetchUserDataFunc() {
      const token = yield* this.validateAuthorizationCode(
        this.tokenEndpoint,
        code,
        codeVerifier
      )

      const user = yield* effetch<Figma.User>(this.apiEndpoint, {
        headers: { Authorization: `Bearer ${token.access_token}` },
      })

      return {
        id: user.id,
        name: user.handle,
        email: user.email,
        image: user.img_url,
      }
    })
}

export namespace Figma {
  export interface User {
    id: string
    handle: string
    email: string
    img_url: string
  }
}
