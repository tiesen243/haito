import type { Effect } from 'effect/Effect'

import * as Context from 'effect/Context'

import type { Post } from '@/domain/entities/post.entity'
import type { HttpError } from '@/shared/http-error'

export class PostRepository extends Context.Tag('PostRepository')<
  PostRepository,
  {
    readonly find: (
      criterias?: Partial<Post>[],
      sort?: Partial<Record<keyof Post, 'asc' | 'desc'>>,
      options?: { limit?: number; offset?: number }
    ) => Effect<Post[], HttpError>
    readonly one: (id: Post['id']) => Effect<Post | null, HttpError>
    readonly save: (post: Post) => Effect<void, HttpError>
    readonly delete: (id: Post['id']) => Effect<void, HttpError>
    readonly count: (criterias?: Partial<Post>[]) => Effect<number, HttpError>
  }
>() {}
