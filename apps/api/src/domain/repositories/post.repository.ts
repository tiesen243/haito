import type { Effect } from 'effect/Effect'

import * as Context from 'effect/Context'

import type { Post } from '@/domain/entities/post.entity'
import type { ApiResponse } from '@/shared/api-response'

export class PostRepository extends Context.Tag('PostRepository')<
  PostRepository,
  {
    readonly find: () => Effect<Post[], ApiResponse>
    readonly one: (id: Post['id']) => Effect<Post | null, ApiResponse>
    readonly save: (post: Post) => Effect<void, ApiResponse>
    readonly delete: (id: Post['id']) => Effect<void, ApiResponse>
  }
>() {}
