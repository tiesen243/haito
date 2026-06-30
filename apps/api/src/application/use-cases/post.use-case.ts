import { Effect } from 'effect'

import type { CreatePostDto } from '@/application/dtos/post.dto'

import { Post } from '@/domain/entities/post.entity'
import { PostRepository } from '@/domain/repositories/post.repository'

export const getPostsUseCase = (): Effect.Effect<
  Post[],
  Error,
  PostRepository
> =>
  Effect.gen(function* getPostsUseCaseFunc() {
    const postRepo = yield* PostRepository
    return yield* postRepo.find()
  })

export const createPostUseCase = (
  input: CreatePostDto.Input
): Effect.Effect<CreatePostDto.Output, Error, PostRepository> =>
  Effect.gen(function* createPostUseCaseFunc() {
    const postRepo = yield* PostRepository

    const newPost = Post.create(input)
    yield* postRepo.save(newPost)
  })
