import type { AnyClass } from '@/core/types'
import type { PostRepository } from '@/modules/post/domain/post.repository'

import { createElysia } from '@/core/create-elysia'
import { CreateDto } from '@/modules/post/application/dtos/create.dto'
import { GetOneDto } from '@/modules/post/application/dtos/get-one.dto'
import { PostController } from '@/modules/post/presenters/post.controller'

export class PostModule {
  constructor(private infraModule: PostRepository) {}

  static withInfrasctructure(infraModule: AnyClass) {
    const infra = new infraModule()
    return new PostModule(infra)
  }

  public register = () => {
    const controller = new PostController(this.infraModule)

    return createElysia({
      name: 'module.post',
      prefix: '/api/v1/posts',
      tags: ['posts'],
    })
      .get('/', () => controller.getAll())

      .get('/:id', ({ params }) => controller.getOne({ id: params.id }), {
        params: GetOneDto.input,
      })

      .post('/', ({ body }) => controller.create(body), {
        body: CreateDto.input,
      })

      .put(
        '/:id',
        ({ params, body }) => controller.update({ id: params.id, ...body }),
        {
          params: GetOneDto.input,
          body: CreateDto.input,
        }
      )

      .delete('/:id', ({ params }) => controller.delete({ id: params.id }), {
        params: GetOneDto.input,
      })
  }
}
