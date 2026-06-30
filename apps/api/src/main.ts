import type { Effect } from 'effect'

import { Layer, ManagedRuntime } from 'effect'
import Elysia from 'elysia'

import { DrizzleClient } from '@/infrastructure/persistence/drizzle'
import { PostRepositoryDrizzle } from '@/infrastructure/persistence/drizzle/repositories/post.repository'
import { postController } from '@/presentation/post.controller'
import { ApiResponse } from '@/shared/api-response'

function main() {
  const layer = Layer.mergeAll(PostRepositoryDrizzle).pipe(
    Layer.provide(DrizzleClient.live)
  )
  const runtime = ManagedRuntime.make(layer)

  const server = new Elysia()
    .derive(() => {
      const run = async <A, E>(effect: Effect.Effect<A, E, never>) => {
        const res = await runtime.runPromiseExit(effect)
        if (res._tag === 'Failure')
          throw ApiResponse.internalServerError('Internal Server Error')
        return ApiResponse.ok('Success', res.value)
      }

      return { run }
    })
    .use(postController)

  return server.compile()
}

export default {
  fetch: main().fetch,
}
