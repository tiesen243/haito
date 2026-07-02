import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { OAuthService } from '@/application/services/oauth.service'
import { GithubOAuth } from '@/infrastructure/oauth/providers/github.oauth'
import { GoogleOAuth } from '@/infrastructure/oauth/providers/google.oauth'
import { HttpError } from '@/shared/http-error'
import { env } from '@/shared/lib/env'

export class OAuthModule {
  static create() {
    return Layer.succeed(OAuthService, {
      forProvider: (provider: string) =>
        Effect.gen(function* forProvider() {
          if (provider === 'google' && env.AUTH_GOOGLE_ID) return GoogleOAuth
          if (provider === 'github' && env.AUTH_GITHUB_ID) return GithubOAuth

          return yield* Effect.fail(
            HttpError.badRequest(`Unsupported OAuth provider: ${provider}`)
          )
        }),
    })
  }
}
