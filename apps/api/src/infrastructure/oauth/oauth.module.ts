import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import type { Config } from '@/shared/config'

import { OAuthService } from '@/application/services/oauth.service'
import { HttpError } from '@/shared/http-error'

export class OAuthModule {
  static create(providers: Config.Options['auth']['providers']) {
    return Layer.succeed(OAuthService, {
      forProvider: (provider: string) =>
        Effect.gen(function* forProviderFunc() {
          for (const p of providers) if (p.providerName === provider) return p
          return yield* HttpError.badRequest(
            `Unsupported OAuth provider: ${provider}`
          )
        }),
    })
  }
}
