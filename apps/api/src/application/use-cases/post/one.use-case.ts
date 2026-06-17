import type { OnePostModel } from '@haito/validators/models/post'

import type { PostRepository } from '@/domain/repositories/post.repository'
import type { UseCaseBase } from '@/shared/bases/use-case.base'

import { ApiResponse } from '@/shared/api-response'

export class OnePostUseCase implements UseCaseBase<
  OnePostModel.Input,
  OnePostModel.Output
> {
  constructor(private readonly _postRepo: PostRepository) {}

  async execute(
    input: OnePostModel.Input
  ): Promise<ApiResponse<OnePostModel.Output>> {
    const post = await this._postRepo.one(input.id)
    if (!post) throw ApiResponse.notFound('Post not found')
    return ApiResponse.ok('Post fetched successfully', post)
  }
}
