import Elysia from 'elysia'

import { CreatePostDto } from '@/application/dtos/post.dto'
import {
  createPostUseCase,
  deletePostUseCase,
  getPostsUseCase,
  getPostUseCase,
} from '@/application/use-cases/post.use-case'

export const postController = new Elysia({
  name: 'controller.post',
  prefix: '/api/posts',
  tags: ['posts'],
})

  .get('/', () => getPostsUseCase())

  .get('/:id', ({ params: { id } }) => getPostUseCase(id))

  .post('/', ({ body }) => createPostUseCase(body), {
    body: CreatePostDto.input,
  })

  .delete('/:id', ({ params: { id } }) => deletePostUseCase(id))
