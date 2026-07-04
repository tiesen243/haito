import * as Effect from 'effect/Effect'

import { HttpError } from '@/shared/http-error'

export const effetch = <A>(
  url: string | Request,
  options?: RequestInit
): Effect.Effect<A, HttpError, never> =>
  Effect.tryPromise({
    try: async () => {
      const response = await fetch(url, options)
      if (!response.ok)
        throw new HttpError({
          status: response.status,
          message: response.statusText,
        })
      return (await response.json()) as A
    },
    catch: (error) =>
      error instanceof HttpError
        ? error
        : HttpError.internalServerError('Failed to fetch data', error),
  })
