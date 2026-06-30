import { eq } from 'drizzle-orm'
import { Effect, Layer } from 'effect'

import { Post } from '@/domain/entities/post.entity'
import { PostRepository } from '@/domain/repositories/post.repository'
import { DrizzleClient } from '@/infrastructure/persistence/drizzle/drizzle.client'
import { posts } from '@/infrastructure/persistence/drizzle/drizzle.schema'

export const PostRepositoryDrizzle = Layer.effect(
  PostRepository,
  Effect.gen(function* PostRepositoryInMemory() {
    const db = yield* DrizzleClient

    return {
      find: () =>
        Effect.gen(function* findPosts() {
          const rows = yield* db.query((client) => client.select().from(posts))
          return rows.map((post) => new Post(post))
        }),

      one: (id: Post['id']) =>
        Effect.gen(function* findPostById() {
          const row = yield* db.query((client) =>
            client.select().from(posts).where(eq(posts.id, id)).limit(1)
          )

          return row[0] ? new Post(row[0]) : null
        }),

      save: (post: Post) =>
        db.query((client) => client.insert(posts).values(post)),

      delete: (id: Post['id']) =>
        db.query((client) => client.delete(posts).where(eq(posts.id, id))),
    }
  })
)
