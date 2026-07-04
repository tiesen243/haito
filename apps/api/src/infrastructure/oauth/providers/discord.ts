import * as Effect from 'effect/Effect'

import type { OAuthService } from '@/application/services/oauth.service'
import type { HttpError } from '@/shared/http-error'

import { BaseProvider } from '@/infrastructure/oauth/providers/base'
import { effetch } from '@/shared/lib/effetch'

export class Discord extends BaseProvider {
  public constructor(clientId: string, clientSecret: string, redirectUri = '') {
    super('discord', clientId, clientSecret, redirectUri)
  }

  private authorizationEndpoint = 'https://discord.com/oauth2/authorize'
  private tokenEndpoint = 'https://discord.com/api/oauth2/token'
  private apiEndpoint = 'https://discord.com/api/users/@me'

  public override createAuthorizationUrl(
    state: string,
    codeVerifier: string
  ): Effect.Effect<URL, never, never> {
    return this.createAuthorizationUrlWithPKCE(
      this.authorizationEndpoint,
      state,
      ['identify', 'email'],
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

      const user = yield* effetch<DiscordUserResponse>(self.apiEndpoint, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      })

      return {
        id: user.id,
        name: user.username,
        email: user.email,
        image: user.avatar
          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
          : '',
      }
    })
  }
}

interface DiscordUserResponse {
  id: string
  username: string
  email: string
  avatar: string | null
}
