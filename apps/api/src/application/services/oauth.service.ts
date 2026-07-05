import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'

import type { BaseProvider } from '@/infrastructure/oauth/providers/base.provider'
import type { HttpError } from '@/shared/http-error'

import { generateStateOrCode } from '@/shared/lib/crypto'

export class OAuthService extends Context.Tag('application/service/OAuth')<
  OAuthService,
  {
    readonly forProvider: (
      provider: string
    ) => Effect.Effect<BaseProvider, HttpError, never>
  }
>() {
  public static setup = (provider: string) =>
    Effect.gen(function* redirectFunc() {
      const _provider = yield* OAuthService.forProvider(provider)

      const state = generateStateOrCode()
      const code = generateStateOrCode()
      const url = yield* _provider.createAuthorizationUrl(state, code)

      return { url, state, code }
    })

  public static validate = (
    provider: string,
    code: string,
    storedCode: string
  ) =>
    Effect.gen(function* validateFunc() {
      const _provider = yield* OAuthService.forProvider(provider)
      return yield* _provider.fetchUserData(code, storedCode)
    })

  private static forProvider = (provider: string) =>
    Effect.flatMap(this, (s) => s.forProvider(provider))
}

export namespace OAuthService {
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
