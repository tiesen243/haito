import type { ElysiaConfig } from 'elysia'

import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as ManagedRuntime from 'effect/ManagedRuntime'
import { Elysia } from 'elysia'

import { InfrastructureModule } from '@/infrastructure/infrastructure.module'
import { HttpError } from '@/shared/http-error'

export function bootstrap<TPrefix extends string>({
  persistenceDriver,
  ...config
}: BootstrapConfig & ElysiaConfig<TPrefix>) {
  const infrastructureModule = InfrastructureModule.create({
    persistenceDriver,
  })

  const appLayer = Layer.mergeAll(infrastructureModule.persistence)

  const runtime = <A>(effect: Effect.Effect<A, HttpError<A>, never>) =>
    ManagedRuntime.make(appLayer).runPromise(
      effect.pipe(
        Effect.map((data) => new HttpError({ data })),
        Effect.catchTag('shared/HttpError', (e) =>
          Effect.succeed(e.toResponse())
        )
      )
    )

  return new Elysia({
    ...config,
  }).onAfterHandle(({ responseValue }) => {
    if (Effect.isEffect(responseValue))
      return runtime(responseValue as never) as never
    return responseValue
  })
}

export interface BootstrapConfig {
  persistenceDriver: 'in-memory' | 'drizzle'
}
