import { CreatePostModel, OnePostModel } from '@haito/validators/models/post'

import type { PostUseCases } from '@/application/types/use-cases'

import { createElysia } from '@/shared/create-elysia'

export const postRoute = (useCases: PostUseCases) =>
  createElysia({
    name: 'route.post',
    prefix: '/api/posts',
  })
    .get('/', () => useCases.list.execute(), {})

    .get('/:id', ({ params }) => useCases.one.execute(params), {
      params: OnePostModel.input,
    })

    .post('/', ({ body }) => useCases.create.execute(body), {
      body: CreatePostModel.input,
    })

    .put(
      '/:id',
      ({ params, body }) => useCases.update.execute({ ...params, ...body }),
      {
        params: OnePostModel.input,
        body: CreatePostModel.input,
      }
    )

    .delete('/:id', ({ params }) => useCases.delete.execute(params), {
      params: OnePostModel.input,
    })
