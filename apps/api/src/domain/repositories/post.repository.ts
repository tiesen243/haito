import type { Effect } from 'effect/Effect'

import * as Context from 'effect/Context'

import type { Post } from '@/domain/entities/post.entity'

export class PostRepository extends Context.Tag('PostRepository')<
  PostRepository,
  {
    readonly find: () => Effect<Post[]>
    readonly one: (id: Post['id']) => Effect<Post | null>
    readonly save: (post: Post) => Effect<void>
  }
>() {}
