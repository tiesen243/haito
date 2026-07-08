import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import type { BootstrapConfig } from '@/bootstrap'
import type { BaseProvider } from '@/infrastructure/oauth/providers/base'

import { HttpError } from '@/shared/http-error'

export class InfrastructureOAuthModule extends Context.Tag(
  'infrastructure/oauth'
)<
  InfrastructureOAuthModule,
  {
    readonly forProvider: (
      providerName: string
    ) => Effect.Effect<BaseProvider, HttpError, never>
  }
>() {
  public static forProvider(providerName: string) {
    return Effect.flatMap(this, (self) => self.forProvider(providerName))
  }

  public static create(providers: BootstrapConfig['providers']) {
    return Layer.succeed(this, {
      forProvider: (providerName: string) =>
        Effect.gen(function* forProviderFunc() {
          for (const provider of providers)
            if (provider.providerName === providerName) return provider

          return yield* HttpError.badRequest(
            `Unsupported provider: ${providerName}`
          )
        }),
    })
  }
}

export namespace InfrastructureOAuthModule {
  export interface User {
    id: string
    name: string
    email: string
    image: string | null
  }

  export interface Token {
    access_token: string
    token_type: string
    expires_in: number
  }
}
