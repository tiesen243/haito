import * as Effect from 'effect/Effect'
import * as ManagedRuntime from 'effect/ManagedRuntime'
import { Elysia } from 'elysia'

import type { ApiResponse } from '@/shared/api-response'

import { InfrastructureModule } from '@/infrastructure/infrastructure.module'

// oxlint-disable-next-line unicorn/no-static-only-class typescript/no-extraneous-class
export class AppModule {
  static create(config: AppModule.Config) {
    const infrastructure = InfrastructureModule.use(config.persistenceDriver)

    const runtime = ManagedRuntime.make(infrastructure.persistence)
    const runProgram = <A>(effect: Effect.Effect<A, ApiResponse, never>) =>
      runtime.runPromise(
        effect.pipe(
          Effect.catchTag('ApiResponse', (res) =>
            Effect.succeed(Response.json(res, { status: res.status }))
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
