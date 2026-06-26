import type { CreateDto } from '@/modules/post/application/dtos/create.dto'
import type { GetAllDto } from '@/modules/post/application/dtos/get-all.dto'
import type { GetOneDto } from '@/modules/post/application/dtos/get-one.dto'
import type { PostRepository } from '@/modules/post/domain/post.repository'

import { ApiResponse } from '@/core/api-response'
import { PostEntity } from '@/modules/post/domain/post.entity'

export class PostController {
  constructor(private readonly _postRepository: PostRepository) {}

  async getAll(
    _input: GetAllDto.Input
  ): Promise<ApiResponse<GetAllDto.Output>> {
    const posts = await this._postRepository.find()
    return ApiResponse.ok(
      'Fetched all posts',
      posts.map((p) => p.mapToJson())
    )
  }

  async getOne(input: GetOneDto.Input): Promise<ApiResponse<GetOneDto.Output>> {
    const { id } = input

    const post = await this._postRepository.findOne(id)
    if (!post) throw ApiResponse.notFound('Post not found')

    return ApiResponse.ok('Fetched post', post.mapToJson())
  }

  async create(input: CreateDto.Input): Promise<ApiResponse<CreateDto.Output>> {
    const { title, content } = input

    const newPost = PostEntity.create({ title, content })
    await this._postRepository.save(newPost)

    return ApiResponse.created('Post created', newPost.mapToJson())
  }

  async update(
    input: CreateDto.Input & { id: PostEntity['id'] }
  ): Promise<ApiResponse<CreateDto.Output>> {
    const { id, title, content } = input

    const existingPost = await this._postRepository.findOne(id)
    if (!existingPost) throw ApiResponse.notFound('Post not found')

    const updatedPost = existingPost.clone({ title, content })
    await this._postRepository.save(updatedPost)

    return ApiResponse.ok('Post updated', updatedPost.mapToJson())
  }

  async delete(input: GetOneDto.Input): Promise<ApiResponse<null>> {
    const { id } = input

    const existingPost = await this._postRepository.findOne(id)
    if (!existingPost) throw ApiResponse.notFound('Post not found')

    await this._postRepository.delete(id)

    return ApiResponse.ok('Post deleted', null)
  }
}
