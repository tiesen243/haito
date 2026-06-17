import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { Elysia } from 'elysia'

import { CreatePostUseCase } from '@/application/use-cases/post/create.use-case'
import { ListPostsUseCase } from '@/application/use-cases/post/list.use-case'
import { OnePostUseCase } from '@/application/use-cases/post/one.use-case'
import { UpdatePostUseCase } from '@/application/use-cases/post/update.use-case'
import { PostRepositoryMemory } from '@/infras/memory/post.repository.menory'
import { postRoute } from '@/interfaces/http/post.route'
import { postTRPC } from '@/interfaces/rpc/post.trpc'
import { ApiResponse } from '@/shared/api-response'
import { loggerPlugin } from '@/shared/plugins/logger.plugin'
import { createTRPCRouter } from '@/shared/trpc'

import packageJson from '../package.json' assert { type: 'json' }

export async function createApp() {
  const postRepo = new PostRepositoryMemory()

  const postUseCases = {
    list: new ListPostsUseCase(postRepo),
    one: new OnePostUseCase(postRepo),
    create: new CreatePostUseCase(postRepo),
    update: new UpdatePostUseCase(postRepo),
  }

  const routes = new Elysia({
    name: 'root.routes',
  })

    .get('/', () =>
      ApiResponse.ok('Welcome to the API!', {
        name: packageJson.name,
        version: packageJson.version,
      })
    )

    .use(postRoute(postUseCases))

  const rpc = new Elysia({
    name: 'root.rpc',
  }).all('/rpc/*', ({ request }) =>
    fetchRequestHandler({
      endpoint: '/rpc',
      req: request,
      router: createTRPCRouter({
        post: postTRPC(postUseCases),
      }),
    })
  )

  return new Elysia({ name: 'root' })
    .use(loggerPlugin)
    .use(routes)
    .use(rpc)
    .compile()
}

export type App = Awaited<ReturnType<typeof createApp>>
