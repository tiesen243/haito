import * as Effect from 'effect/Effect'

import { HttpError } from '@/shared/http-error'

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
