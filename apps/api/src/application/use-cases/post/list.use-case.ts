import type { ListPostsModel } from '@haito/validators/models/post'

import type { PostRepository } from '@/domain/repositories/post.repository'
import type { UseCaseBase } from '@/shared/bases/use-case.base'

import { ApiResponse } from '@/shared/api-response'

export class ListPostsUseCase implements UseCaseBase<
  ListPostsModel.Input,
  ListPostsModel.Output
> {
  constructor(private readonly _postRepo: PostRepository) {}

  async execute(
    _input: ListPostsModel.Input
  ): Promise<ApiResponse<ListPostsModel.Output>> {
    const posts = await this._postRepo.find()
    if (posts.length === 0) throw ApiResponse.notFound('No posts found')
    return ApiResponse.ok('Posts fetched successfully', posts)
  }
}
