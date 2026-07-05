import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Ref from 'effect/Ref'

import { Post } from '@/domain/entities/post.entity'
import { PostRepository } from '@/domain/repositories/post.repository'

const store = Ref.unsafeMake<Record<string, Post>>({})

export const PostRepositoryInMemory = Layer.succeed(PostRepository, {
  find: (
    _criterias: Partial<Post>[] = [],
    _sort: Partial<Record<keyof Post, 'asc' | 'desc'>> = {},
    _options: { limit?: number; offset?: number } = {}
  ) =>
    Ref.get(store).pipe(
      Effect.map((dict) => Object.values(dict).map((p) => new Post(p)))
    ),

  one: (id: Post['id']) =>
    Ref.get(store).pipe(
      Effect.map((dict) => (dict[id] ? new Post(dict[id]) : null))
    ),

  save: (post: Post) =>
    Ref.update(store, (dict) => ({ ...dict, [post.id]: post })),

  delete: (id: Post['id']) =>
    Ref.update(store, (dict) => {
      const { [id]: _, ...rest } = dict
      return rest
    }),

  count: (_criterias: Partial<Post>[] = []) =>
    Ref.get(store).pipe(Effect.map((dict) => Object.keys(dict).length)),
})
