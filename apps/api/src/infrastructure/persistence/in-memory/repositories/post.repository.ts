import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Ref from 'effect/Ref'

import type { Post } from '@/domain/entities/post.entity'

import { PostRepository } from '@/domain/repositories/post.repository'

export const PostRepositoryInMemory = Layer.effect(
  PostRepository,
  Effect.gen(function* PostRepositoryInMemory() {
    const store = yield* Ref.make<Record<string, Post>>({})

    return {
      find: () =>
        Ref.get(store).pipe(Effect.map((dict) => Object.values(dict))),

      one: (id: Post['id']) =>
        Ref.get(store).pipe(Effect.map((dict) => dict[id] ?? null)),

      save: (post: Post) =>
        Ref.update(store, (dict) => ({ ...dict, [post.id]: post })),

      delete: (id: Post['id']) =>
        Ref.update(store, (dict) => {
          const { [id]: _, ...rest } = dict
          return rest
        }),
    }
  })
)
