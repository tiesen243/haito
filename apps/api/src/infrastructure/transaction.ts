import * as Effect from 'effect/Effect'

import { DrizzleClient } from '@/infrastructure/persistence/drizzle/drizzle.client'
import { HttpError } from '@/shared/http-error'

export const runInTransaction = <A, E>(
  effect: Effect.Effect<A, E | HttpError>
) =>
  Effect.gen(function* runInTransactionFunc() {
    const drizzleClient = yield* DrizzleClient

    return yield* Effect.tryPromise({
      try: () =>
        drizzleClient.client.transaction((tx) => 
          Effect.runPromise(
            Effect.provideService(
              effect,
              DrizzleClient,
              drizzleClient.withClient(tx)
            )
          )
        ),
      catch: (error) =>
        HttpError.internalServerError('Database transaction failed', error),
    })
  })
