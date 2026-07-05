import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as ManagedRuntime from 'effect/ManagedRuntime'
import { Elysia } from 'elysia'

import { JWTService } from '@/application/services/jwt.service'
import { InfrastructureModule } from '@/infrastructure/infrastructure.module'
import { Config } from '@/shared/config'
import { HttpError } from '@/shared/http-error'

export function bootstrap(_config: Config.Options) {
  const config = Config.create(_config)

  const infrastructure = InfrastructureModule.use(
    _config.persistenceDriver,
    _config.auth.providers
  )

  const runtimeLayer = Layer.mergeAll(
    infrastructure.persistence,
    infrastructure.oauth,
    JWTService.live,
    config
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
