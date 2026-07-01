import * as Effect from 'effect/Effect'
import * as ManagedRuntime from 'effect/ManagedRuntime'
import { Elysia } from 'elysia'

import { InfrastructureModule } from '@/infrastructure/infrastructure.module'
import { HttpError } from '@/shared/http-error'

// oxlint-disable-next-line unicorn/no-static-only-class typescript/no-extraneous-class
export class AppModule {
  static create(config: AppModule.Config) {
    const infrastructure = InfrastructureModule.use(config.persistenceDriver)

    const runtime = ManagedRuntime.make(infrastructure.persistence)
    const runProgram = <A>(effect: Effect.Effect<A, HttpError, never>) =>
      runtime.runPromise(
        effect.pipe(
          Effect.map(
            (data) =>
              new HttpError({
                status: 200,
                message: 'Resource fetched successfully',
                data,
              })
          ),
          Effect.catchTag('HttpError', (result) =>
            Effect.succeed(result.toResponse())
          )
        )
      )

    return new Elysia({
      name: 'module.app',
      aot: true,
    }).onAfterHandle(({ responseValue }) => {
      if (Effect.isEffect(responseValue))
        return runProgram(responseValue as never)
      return responseValue
    })
  }
}

export namespace AppModule {
  export interface Config {
    persistenceDriver: 'in-memory' | 'drizzle'
  }
}
