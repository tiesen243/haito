import { cors } from '@elysia/cors'
import { Elysia } from 'elysia'

import { CreatePostUseCase } from '@/application/use-cases/post/create.use-case'
import { ListPostsUseCase } from '@/application/use-cases/post/list.use-case'
import { OnePostUseCase } from '@/application/use-cases/post/one.use-case'
import { UpdatePostUseCase } from '@/application/use-cases/post/update.use-case'
import { PostRepositoryMemory } from '@/infras/memory/post.repository.menory'
import { postRoute } from '@/interfaces/http/post.route'
import { loggerPlugin } from '@/shared/plugins/logger.plugin'

// oxlint-disable-next-line require-await
export async function createApp() {
  const postRepo = new PostRepositoryMemory()

  const postUseCases = {
    list: new ListPostsUseCase(postRepo),
    one: new OnePostUseCase(postRepo),
    create: new CreatePostUseCase(postRepo),
    update: new UpdatePostUseCase(postRepo),
  }

  const app = new Elysia()
    // Register plugins
    .use(loggerPlugin)
    .use(cors())

    // Register HTTP routes
    .use(postRoute(postUseCases))

  return app.compile()
}
