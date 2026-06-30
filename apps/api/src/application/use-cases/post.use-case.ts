import { Effect } from 'effect'

import type { CreatePostDto } from '@/application/dtos/post.dto'

import { Post } from '@/domain/entities/post.entity'
import { PostRepository } from '@/domain/repositories/post.repository'
import { ApiResponse } from '@/shared/api-response'

export const getPostsUseCase = () =>
  Effect.gen(function* getPostsUseCaseFunc() {
    const postRepo = yield* PostRepository
    const posts = yield* postRepo.find()

    return yield* ApiResponse.ok('Posts fetched successfully', posts)
  })

export const getPostUseCase = (id: Post['id']) =>
  Effect.gen(function* getPostUseCaseFunc() {
    const postRepo = yield* PostRepository
    const post = yield* postRepo.one(id)

    if (!post) return yield* ApiResponse.notFound('Post not found')

    return yield* ApiResponse.ok('Post fetched successfully', post)
  })

export const createPostUseCase = (
  input: CreatePostDto.Input
): Effect.Effect<CreatePostDto.Output, Error, PostRepository> =>
  Effect.gen(function* createPostUseCaseFunc() {
    const postRepo = yield* PostRepository

    const newPost = Post.create(input)
    yield* postRepo.save(newPost)

    return yield* ApiResponse.created('Post created successfully', newPost)
  })

export const deletePostUseCase = (id: Post['id']) =>
  Effect.gen(function* deletePostUseCaseFunc() {
    const postRepo = yield* PostRepository

    const post = yield* postRepo.one(id)
    if (!post) return yield* ApiResponse.notFound('Post not found')

    yield* postRepo.delete(id)

    return yield* ApiResponse.ok('Post deleted successfully')
  })
