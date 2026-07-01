import { describe, expect, it, beforeEach } from 'bun:test'
import * as Exit from 'effect/Exit'
import * as ManagedRuntime from 'effect/ManagedRuntime'

import type { PostRepository } from '@/domain/repositories/post.repository'

import {
  createPostUseCase,
  deletePostUseCase,
  getPostUseCase,
  getPostsUseCase,
} from '@/application/use-cases/post.use-case'
import { InMemoryPersistenceModule } from '@/infrastructure/persistence/in-memory/in-memory.module'

describe('Post Use Cases', () => {
  let runtime: ManagedRuntime.ManagedRuntime<PostRepository, never>

  beforeEach(() => {
    runtime = ManagedRuntime.make(InMemoryPersistenceModule.create())
  })

  // =========================================================================
  // 1. TEST GET ALL POSTS
  // =========================================================================
  describe('getPostsUseCase', () => {
    it('should fetch all posts successfully', async () => {
      const exitResult = await runtime.runPromiseExit(getPostsUseCase())

      expect(Exit.isSuccess(exitResult)).toBe(true)
      if (Exit.isSuccess(exitResult)) {
        const apiResponse = exitResult.value
        expect(apiResponse.status).toBe(200)
        expect(apiResponse.message).toBe('Posts fetched successfully')
        expect(apiResponse.data).toEqual([])
      }
    })

    it('should fetch all posts successfully khi có dữ liệu', async () => {
      const input = { title: 'Sample Post', content: 'This is a sample post.' }
      await runtime.runPromise(createPostUseCase(input))

      const exitResult = await runtime.runPromiseExit(getPostsUseCase())
      expect(Exit.isSuccess(exitResult)).toBe(true)

      if (Exit.isSuccess(exitResult)) {
        const apiResponse = exitResult.value
        expect(apiResponse.status).toBe(200)
        expect(apiResponse.data?.length).toBe(1)
        expect(apiResponse.data?.[0]?.title).toBe(input.title)
      }
    })
  })

  // =========================================================================
  // 2. TEST GET SINGLE POST BY ID
  // =========================================================================
  describe('getPostUseCase', () => {
    it('should fetch a single post successfully by id', async () => {
      const input = { title: 'Sample Post', content: 'This is a sample post.' }
      const createRes = await runtime.runPromise(createPostUseCase(input))
      const createdPostId = createRes.data?.id ?? ''

      const exitResult = await runtime.runPromiseExit(
        getPostUseCase({ id: createdPostId })
      )

      expect(Exit.isSuccess(exitResult)).toBe(true)
      if (Exit.isSuccess(exitResult)) {
        const apiResponse = exitResult.value
        expect(apiResponse.status).toBe(200)
        expect(apiResponse.message).toBe('Post fetched successfully')
        expect(apiResponse.data?.id).toBe(createdPostId)
      }
    })

    it('should throw and return 404 when post is not found', async () => {
      const exitResult = await runtime.runPromiseExit(
        getPostUseCase({ id: 'id-fake-123' })
      )

      expect(Exit.isFailure(exitResult)).toBe(true)

      if (Exit.isFailure(exitResult)) {
        const { cause } = exitResult
        if (cause._tag === 'Fail') {
          expect(cause.error.status).toBe(404)
          expect(cause.error.message).toBe('Post not found')
        } else
          expect().fail(
            'Expected a failure with ApiResponse, but got a different exit cause'
          )
      }
    })
  })

  // =========================================================================
  // 3. TEST CREATE POST
  // =========================================================================
  describe('createPostUseCase', () => {
    it('should create and store a post successfully', async () => {
      const input = {
        title: 'New Post Title',
        content: 'This is the content of the new post.',
      }

      const exitResult = await runtime.runPromiseExit(createPostUseCase(input))

      expect(Exit.isSuccess(exitResult)).toBe(true)
      if (Exit.isSuccess(exitResult)) {
        const apiResponse = exitResult.value
        expect(apiResponse.status).toBe(201)
        expect(apiResponse.message).toBe('Post created successfully')
        expect(apiResponse.data?.title).toBe(input.title)
        expect(apiResponse.data?.id).toBeDefined()
      }
    })
  })

  // =========================================================================
  // 4. TEST DELETE POST
  // =========================================================================
  describe('deletePostUseCase', () => {
    it('should delete a post successfully when ID exists', async () => {
      const createRes = await runtime.runPromise(
        createPostUseCase({
          title: 'Post to Delete',
          content: 'Content of the post to delete',
        })
      )
      const targetId = createRes.data?.id ?? ''

      const exitResult = await runtime.runPromiseExit(
        deletePostUseCase({ id: targetId })
      )

      expect(Exit.isSuccess(exitResult)).toBe(true)
      if (Exit.isSuccess(exitResult)) {
        const apiResponse = exitResult.value
        expect(apiResponse.status).toBe(200)
        expect(apiResponse.message).toBe('Post deleted successfully')
      }

      const checkExit = await runtime.runPromiseExit(
        getPostUseCase({ id: targetId })
      )
      expect(Exit.isFailure(checkExit)).toBe(true)
    })

    it('should throw and return 404 when trying to delete non-existent post', async () => {
      const exitResult = await runtime.runPromiseExit(
        deletePostUseCase({ id: 'non-existent-id' })
      )

      expect(Exit.isFailure(exitResult)).toBe(true)

      if (Exit.isFailure(exitResult)) {
        const { cause } = exitResult

        if (cause._tag === 'Fail') {
          expect(cause.error.status).toBe(404)
          expect(cause.error.message).toBe('Post not found')
        } else
          expect().fail(
            'Expected a failure with ApiResponse, but got a different exit cause'
          )
      }
    })
  })
})
