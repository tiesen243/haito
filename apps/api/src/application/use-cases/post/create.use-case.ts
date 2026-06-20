import type { CreatePostModel } from '@haito/validators/models/post'

import type { PostRepository } from '@/domain/repositories/post.repository'
import type { UseCaseBase } from '@/shared/bases/use-case.base'

import { PostEntity } from '@/domain/entities/post.entity'
import { ApiResponse } from '@/shared/api-response'

export class CreatePostUseCase implements UseCaseBase<
  CreatePostModel.Input,
  CreatePostModel.Output
> {
  constructor(private readonly _postRepo: PostRepository) {}

  async execute(
    input: CreatePostModel.Input
  ): Promise<ApiResponse<CreatePostModel.Output>> {
    const post = new PostEntity(input)
    await this._postRepo.insert(post)
    return ApiResponse.created('Post created successfully', { id: post.id })
  }
}
