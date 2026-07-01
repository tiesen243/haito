import Elysia from 'elysia'

import {
  CreatePostDto,
  GetPostDto,
  GetPostsDto,
} from '@/application/dtos/post.dto'
import {
  createPostUseCase,
  deletePostUseCase,
  getPostsUseCase,
  getPostUseCase,
  updatePostUseCase,
} from '@/application/use-cases/post.use-case'

export const postController = new Elysia({
  name: 'controller.post',
  prefix: '/api/posts',
  tags: ['posts'],
})

  .get('/', ({ query }) => getPostsUseCase(query), { query: GetPostsDto.input })

  .get('/:id', ({ params: { id } }) => getPostUseCase({ id }), {
    params: GetPostDto.input,
  })

  .post('/', ({ body }) => createPostUseCase(body), {
    body: CreatePostDto.input,
  })

  .put(
    '/:id',
    ({ params: { id }, body }) => updatePostUseCase({ id, ...body }),
    { params: GetPostDto.input, body: CreatePostDto.input }
  )

  .delete('/:id', ({ params: { id } }) => deletePostUseCase({ id }), {
    params: GetPostDto.input,
  })
