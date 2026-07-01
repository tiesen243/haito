import type { YieldWrap } from 'effect/Utils'

import * as Effect from 'effect/Effect'

import type { HttpError } from '@/shared/http-error'

export const createUseCase =
  <TInput, TOutput, TError = HttpError>(
    useCaseFunc: (
      input: TInput
    ) => (
      resume: Effect.Adapter
    ) => Generator<YieldWrap<unknown>, TOutput, never>
  ) =>
  (input: TInput): Effect.Effect<TOutput, TError, unknown> =>
    Effect.gen(useCaseFunc(input) as never)
