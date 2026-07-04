import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as ManagedRuntime from 'effect/ManagedRuntime'
import { Elysia } from 'elysia'

import { JWT } from '@/application/services/jwt.service'
import { InfrastructureModule } from '@/infrastructure/infrastructure.module'
import { HttpError } from '@/shared/http-error'

export class AppModule {
  static bootstrap(config: AppModule.Config) {
    const infrastructure = InfrastructureModule.use(config.persistenceDriver)
    const runtimeLayer = Layer.mergeAll(
      infrastructure.persistence,
      infrastructure.oauth,
      JWT.live(config.jwt)
    )

    const run = <A>(effect: Effect.Effect<A, HttpError, never>) =>
      ManagedRuntime.make(runtimeLayer).runPromise(
        effect.pipe(
          Effect.map((data) => new HttpError({ data })),
          Effect.catchTag('HttpError', (result) =>
            Effect.succeed(result.toResponse())
          )
        )
      )

    return new Elysia({
      name: 'module.app',
      aot: true,
    }).onAfterHandle(({ responseValue }) => {
      if (Effect.isEffect(responseValue)) return run(responseValue as never)
      return responseValue
    })
  }
}

export namespace AppModule {
  export interface Config {
    persistenceDriver: 'in-memory' | 'drizzle'
    oauthProviders: string[]
    jwt: {
      secret: string
      algorithm: 'HS256' | 'HS384' | 'HS512'
    }
  }
}
