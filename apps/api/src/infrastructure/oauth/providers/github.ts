import * as Effect from 'effect/Effect'

import type { OAuthService } from '@/application/services/oauth.service'
import type { HttpError } from '@/shared/http-error'

import { BaseProvider } from '@/infrastructure/oauth/providers/base'
import { effetch } from '@/shared/lib/effetch'

export class Github extends BaseProvider {
  public constructor(clientId: string, clientSecret: string, redirectUri = '') {
    super('github', clientId, clientSecret, redirectUri)
  }

  private authorizationEndpoint = 'https://github.com/login/oauth/authorize'
  private tokenEndpoint = 'https://github.com/login/oauth/access_token'
  private apiEndpoint = 'https://api.github.com/user'

  public override createAuthorizationUrl(
    state: string,
    codeVerifier: string
  ): Effect.Effect<URL, never, never> {
    return this.createAuthorizationUrlWithPKCE(
      this.authorizationEndpoint,
      state,
      ['read:user', 'user:email'],
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

      const user = yield* effetch<GithubUserResponse>(self.apiEndpoint, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      })

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.avatar_url,
      }
    })
  }
}

interface GithubUserResponse {
  id: string
  name: string
  email: string
  avatar_url: string
}
