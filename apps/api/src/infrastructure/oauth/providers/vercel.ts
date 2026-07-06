import * as Effect from 'effect/Effect'

import type { InfrastructureOAuthModule } from '@/infrastructure/oauth/oauth.module'

import { BaseProvider } from '@/infrastructure/oauth/providers/base'
import { effetch } from '@/shared/lib/effetch'

export class Vercel extends BaseProvider {
  public constructor(clientId: string, clientSecret: string, redirectUri = '') {
    super('vercel', clientId, clientSecret, redirectUri)
  }

  private authorizationEndpoint = 'https://vercel.com/oauth/authorize'
  private tokenEndpoint = 'https://api.vercel.com/login/oauth/token'
  private apiEndpoint = 'https://api.vercel.com/login/oauth/userinfo'

  public override createAuthorizationUrl = (
    state: string,
    codeVerifier: string
  ): Effect.Effect<URL> =>
    this.createAuthorizationUrlWithPKCE(
      this.authorizationEndpoint,
      state,
      ['openid', 'email', 'profile'],
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

      const user = yield* effetch<Vercel.User>(this.apiEndpoint, {
        headers: { Authorization: `Bearer ${token.access_token}` },
      })

      return {
        id: user.sub,
        name: user.name,
        email: user.email,
        image: user.picture,
      }
    })
}

export namespace Vercel {
  export interface User {
    sub: string
    name: string
    email: string
    picture: string
    preferred_username: string
  }
}
