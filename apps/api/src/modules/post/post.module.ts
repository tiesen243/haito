import type { AnyElysia } from 'elysia'

import { createElysia } from '@/core/create-elysia'
import { PostService } from '@/modules/post/application/post.service'
import { createPostController } from '@/modules/post/presentation/post.controller'

export class PostModule {
  protected readonly name = 'module.post'

  public static create(): AnyElysia {
    const module = new PostModule()

    const service = new PostService()
    const postController = createPostController(service)

    return createElysia({
      name: module.name,
    }).use(postController)
  }
}
