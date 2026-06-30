import type { Effect } from 'effect'
import type { Exit } from 'effect/Exit'

import Elysia from 'elysia'

import { CreatePostDto } from '@/application/dtos/post.dto'
import {
  createPostUseCase,
  getPostsUseCase,
} from '@/application/use-cases/post.use-case'

export const postController = new Elysia({
  name: 'controller.post',
  prefix: '/api/posts',
})
  .decorate(
    'run',
    {} as <A, E>(effect: Effect.Effect<A, E, unknown>) => Promise<Exit<A, E>>
  )

  .get('/', ({ run }) => run(getPostsUseCase()))

  .post('/', ({ body, run }) => run(createPostUseCase(body)), {
    body: CreatePostDto.input,
  })
