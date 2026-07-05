import type {
  CreatePostDto,
  GetPostDto,
  GetPostsDto,
} from '@/application/dtos/post.dto'

import { Post } from '@/domain/entities/post.entity'
import { PostRepository } from '@/domain/repositories/post.repository'
import { HttpError } from '@/shared/http-error'
import { createUseCase } from '@/shared/lib/create-use-case'

export const getPostsUseCase = createUseCase<
  GetPostsDto.Input,
  GetPostsDto.Output
>(
  (input) =>
    function* getPostsUseCaseFunc() {
      const postRepo = yield* PostRepository

      const { query, page, limit: pageSize } = input
      const offset = (page - 1) * pageSize

      const posts = yield* postRepo.find(
        query ? [{ title: query }] : [],
        { updatedAt: 'desc' },
        { limit: pageSize, offset }
      )

      const total = yield* postRepo.count(query ? [{ title: query }] : [])
      const totalPages = Math.ceil(total / pageSize)

      return {
        posts,
        meta: { page, pageSize, total, totalPages },
      }
    }
)

export const getPostUseCase = createUseCase<
  GetPostDto.Input,
  GetPostDto.Output
>(
  (input) =>
    function* getPostUseCaseFunc() {
      const postRepo = yield* PostRepository
      const post = yield* postRepo.one(input.id)

      if (!post) return yield* HttpError.notFound('Post not found')
      return post
    }
)

export const createPostUseCase = createUseCase<
  CreatePostDto.Input,
  CreatePostDto.Output,
  PostRepository
>(
  (input) =>
    function* createPostUseCaseFunc() {
      const postRepo = yield* PostRepository

      const newPost = Post.create({ ...input, userId: '' })
      yield* postRepo.save(newPost)

      return newPost
    }
)

export const updatePostUseCase = createUseCase<
  GetPostDto.Input & Partial<CreatePostDto.Input>,
  GetPostDto.Output
>(
  (input) =>
    function* updatePostUseCaseFunc() {
      const postRepo = yield* PostRepository

      const post = yield* postRepo.one(input.id)
      if (!post) return yield* HttpError.notFound('Post not found')

      const updatedPost = post.clone({
        title: input.title ?? post.title,
        content: input.content ?? post.content,
      })
      yield* postRepo.save(updatedPost)

      return updatedPost
    }
)

export const deletePostUseCase = createUseCase<
  GetPostDto.Input,
  GetPostDto.Output
>(
  (input) =>
    function* deletePostUseCaseFunc() {
      const postRepo = yield* PostRepository

      const post = yield* postRepo.one(input.id)
      if (!post) return yield* HttpError.notFound('Post not found')

      yield* postRepo.delete(input.id)

      return post
    }
)
