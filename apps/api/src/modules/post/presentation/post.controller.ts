import type { PostService } from '@/modules/post/application/post.service'

import { ApiResponse } from '@/core/api-response'
import { createElysia } from '@/core/create-elysia'

export const createPostController = (service: PostService) =>
  createElysia({
    name: 'controller.post',
    prefix: '/api/posts',
  })
    .get('/', () =>
      ApiResponse.ok(
        'Posts retrieved successfully',
        service.all().map((post) => post.mapToJson())
      )
    )

    .get('/:id', ({ params }) => {
      const post = service.one(params.id)
      if (!post)
        return ApiResponse.notFound(`Post with ID ${params.id} not found`)

      return ApiResponse.ok('Post retrieved successfully', post.mapToJson())
    })

    .post('/', ({ body }) => {
      const { title, content } = body as { title: string; content: string }
      service.create({ title, content })

      return ApiResponse.created('Post created successfully', null)
    })

    .put('/:id', ({ params, body }) => {
      const { title, content } = body as { title: string; content: string }
      service.update(params.id, { title, content })
      return ApiResponse.ok('Post updated successfully', null)
    })

    .delete('/:id', ({ params }) => {
      service.delete(params.id)
      return ApiResponse.ok('Post deleted successfully', null)
    })
