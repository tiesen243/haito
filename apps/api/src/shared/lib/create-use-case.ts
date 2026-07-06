import type { YieldWrap } from 'effect/Utils'

import * as Effect from 'effect/Effect'

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
