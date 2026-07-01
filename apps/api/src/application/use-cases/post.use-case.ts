import * as Effect from 'effect/Effect'

import type { CreatePostDto, GetPostDto } from '@/application/dtos/post.dto'

import { Post } from '@/domain/entities/post.entity'
import { PostRepository } from '@/domain/repositories/post.repository'
import { ApiResponse } from '@/shared/api-response'

export const getPostsUseCase = () =>
  Effect.gen(function* getPostsUseCaseFunc() {
    const postRepo = yield* PostRepository
    const posts = yield* postRepo.find()

    return ApiResponse.ok('Posts fetched successfully', posts)
  })

export const getPostUseCase = (input: GetPostDto.Input) =>
  Effect.gen(function* getPostUseCaseFunc() {
    const postRepo = yield* PostRepository
    const post = yield* postRepo.one(input.id)

    if (!post) return yield* ApiResponse.notFound('Post not found')

    return ApiResponse.ok('Post fetched successfully', post)
  })

export const createPostUseCase = (input: CreatePostDto.Input) =>
  Effect.gen(function* createPostUseCaseFunc() {
    const postRepo = yield* PostRepository

    const newPost = Post.create(input)
    yield* postRepo.save(newPost)

    return ApiResponse.created('Post created successfully', newPost)
  })

export const deletePostUseCase = (input: GetPostDto.Input) =>
  Effect.gen(function* deletePostUseCaseFunc() {
    const postRepo = yield* PostRepository

    const post = yield* postRepo.one(input.id)
    if (!post) return yield* ApiResponse.notFound('Post not found')

    yield* postRepo.delete(input.id)

    return ApiResponse.ok('Post deleted successfully')
  })
