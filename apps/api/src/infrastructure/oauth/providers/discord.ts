import * as Effect from 'effect/Effect'

import type { InfrastructureOAuthModule } from '@/infrastructure/oauth/oauth.module'

import { BaseProvider } from '@/infrastructure/oauth/providers/base'
import { effetch } from '@/shared/lib/utils'

export class Discord extends BaseProvider {
  public constructor(clientId: string, clientSecret: string, redirectUri = '') {
    super('discord', clientId, clientSecret, redirectUri)
  }

  private authorizationEndpoint = 'https://discord.com/oauth2/authorize'
  private tokenEndpoint = 'https://discord.com/api/oauth2/token'
  private apiEndpoint = 'https://discord.com/api/users/@me'

  public override createAuthorizationUrl = (
    state: string,
    codeVerifier: string
  ): Effect.Effect<URL> =>
    this.createAuthorizationUrlWithPKCE(
      this.authorizationEndpoint,
      state,
      ['identify', 'email'],
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

      const user = yield* effetch<Discord.User>(this.apiEndpoint, {
        headers: { Authorization: `Bearer ${token.access_token}` },
      })

      return {
        id: user.id,
        name: user.username,
        email: user.email,
        image: user.avatar
          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
          : null,
      }
    })
}

export namespace Discord {
  export interface User {
    id: string
    username: string
    email: string
    avatar: string | null
  }
}
