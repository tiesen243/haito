import type { YieldWrap } from 'effect/Utils'

import * as Effect from 'effect/Effect'
import * as Option from 'effect/Option'

import { DrizzleClient } from '@/infrastructure/persistence/drizzle/drizzle.client'
import { HttpError } from '@/shared/http-error'

export const createUseCase =
  <TInput, TOutput>(
    useCaseFunc: (
      input: TInput
    ) => (
      resume: Effect.Adapter
    ) => Generator<YieldWrap<unknown>, TOutput, never>
  ) =>
  (input: TInput): Effect.Effect<TOutput> =>
    Effect.gen(useCaseFunc(input) as never) as Effect.Effect<TOutput>

export function effetch<TData = unknown>(
  input: string | URL | Request,
  init?: RequestInit
): Effect.Effect<TData, HttpError> {
  return Effect.gen(function* effetchFunc() {
    const response = yield* Effect.tryPromise({
      try: () => fetch(input, init),
      catch: (error) =>
        HttpError.internalServerError(
          'Failed to fetch data from the server',
          error
        ),
    })

    if (!response.ok)
      return yield* new HttpError({
        status: response.status,
        message: response.statusText,
      })

    return yield* Effect.tryPromise({
      try: () => response.json() as Promise<TData>,
      catch: (error) =>
        HttpError.internalServerError(
          'Failed to parse response data from the server',
          error
        ),
    })
  })
}

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
