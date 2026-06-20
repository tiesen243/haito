import type {
  CreatePostModel,
  OnePostModel,
} from '@haito/validators/models/post'

import type { PostRepository } from '@/domain/repositories/post.repository'
import type { UseCaseBase } from '@/shared/bases/use-case.base'

import { ApiResponse } from '@/shared/api-response'

export class UpdatePostUseCase implements UseCaseBase<
  OnePostModel.Input & CreatePostModel.Input,
  CreatePostModel.Output
> {
  constructor(private readonly _postRepo: PostRepository) {}

  async execute(
    input: OnePostModel.Input & CreatePostModel.Input
  ): Promise<ApiResponse<CreatePostModel.Output>> {
    const post = await this._postRepo.one(input.id)
    if (!post) throw ApiResponse.notFound('Post not found')
    const updatedPost = post.clone({ title: input.title })
    await this._postRepo.update(updatedPost)
    return ApiResponse.ok('Post updated successfully', { id: updatedPost.id })
  }
}
