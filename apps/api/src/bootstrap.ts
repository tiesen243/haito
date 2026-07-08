import type { ElysiaConfig } from 'elysia'

import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as ManagedRuntime from 'effect/ManagedRuntime'
import { Elysia } from 'elysia'

import type { BaseProvider } from '@/infrastructure/oauth/providers/base'

import { InfrastructureModule } from '@/infrastructure/infrastructure.module'
import { HttpError } from '@/shared/http-error'

export function bootstrap<TPrefix extends string>({
  persistenceDriver,
  providers,
  ...config
}: BootstrapConfig & ElysiaConfig<TPrefix>) {
  const infrastructureModule = InfrastructureModule.create({
    persistenceDriver,
    providers,
  })

  const appRuntime = ManagedRuntime.make(
    Layer.mergeAll(infrastructureModule.persistence, infrastructureModule.oauth)
  )

  const runtime = <A>(effect: Effect.Effect<A, HttpError<A>, never>) =>
    appRuntime.runPromise(
      effect.pipe(
        Effect.map((data) => new HttpError({ data })),
        Effect.catchTag('shared/HttpError', (e) =>
          Effect.succeed(e.toResponse())
        )
      )
    )

  return new Elysia({
    ...config,
  }).mapResponse(({ responseValue }) => {
    if (Effect.isEffect(responseValue))
      return runtime(responseValue as never) as never
    return responseValue as never
  })
}

export interface BootstrapConfig {
  persistenceDriver: 'in-memory' | 'drizzle'
  providers: BaseProvider[]
}
