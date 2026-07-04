import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { OAuthService } from '@/application/services/oauth.service'
import { Github } from '@/infrastructure/oauth/providers/github'
import { Google } from '@/infrastructure/oauth/providers/google'
import { HttpError } from '@/shared/http-error'
import { env } from '@/shared/lib/env'

export class OAuthModule {
  static providers = [
    new Google(env.AUTH_GOOGLE_ID, env.AUTH_GOOGLE_SECRET),
    new Github(env.AUTH_GITHUB_ID, env.AUTH_GITHUB_SECRET),
  ]

  static create() {
    return Layer.succeed(OAuthService, {
      forProvider: (provider: string) =>
        Effect.gen(function* forProviderFunc() {
          for (const p of OAuthModule.providers)
            if (p.providerName === provider) return p

          return yield* HttpError.badRequest(
            `Unsupported OAuth provider: ${provider}`
          )
        }),
    })
  }
}
