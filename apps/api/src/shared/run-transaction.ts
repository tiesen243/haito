import type { YieldWrap } from 'effect/Utils'

import * as Effect from 'effect/Effect'
import * as Option from 'effect/Option'

import { DrizzleClient } from '@/infrastructure/persistence/drizzle/drizzle.client'
import { HttpError } from '@/shared/http-error'

export const runTransaction = <A, E>(
  transaction: () => Generator<YieldWrap<unknown>, A, never>
): Effect.Effect<A, E | HttpError, DrizzleClient> =>
  Effect.all({
    maybeDrizzle: Effect.serviceOption(DrizzleClient),
  }).pipe(
    Effect.flatMap(({ maybeDrizzle }) => {
      if (Option.isSome(maybeDrizzle)) {
        const { db } = maybeDrizzle.value
        return Effect.suspend(() => {
          const promise = db.transaction((tx) => {
            const client = DrizzleClient.make(tx as never)
            const program = Effect.provideService(
              DrizzleClient,
              client
            )(Effect.gen(transaction as never))
            return Effect.runPromise(program as Effect.Effect<A, E, never>)
          })

          return Effect.tryPromise({
            try: () => promise,
            catch: (e) =>
              HttpError.internalServerError('Drizzle transaction failed', e),
          })
        })
      }

      return Effect.gen(transaction as never)
    })
  )
