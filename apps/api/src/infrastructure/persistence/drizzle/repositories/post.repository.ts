import type { SQL } from 'drizzle-orm'

import { and, asc, desc, eq, or } from 'drizzle-orm'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { Post } from '@/domain/entities/post.entity'
import { PostRepository } from '@/domain/repositories/post.repository'
import { DrizzleClient } from '@/infrastructure/persistence/drizzle/drizzle.client'
import { posts } from '@/infrastructure/persistence/drizzle/drizzle.schema'

export const PostRepositoryDrizzle = Layer.effect(
  PostRepository,
  Effect.gen(function* PostRepositoryInMemory() {
    const db = yield* DrizzleClient

    return {
      find: (
        criterias: Partial<Post>[] = [],
        sort: Partial<Record<keyof Post, 'asc' | 'desc'>> = {},
        options: { limit?: number; offset?: number } = {}
      ) =>
        Effect.gen(function* findPosts() {
          const whereClause = buildCriteria(criterias)
          const sortClause = buildSort(sort)

          const rows = yield* db.query((client) => {
            const query = client.select().from(posts).$dynamic()

            if (whereClause) query.where(whereClause)
            if (sortClause) query.orderBy(...sortClause)
            if (options.limit) query.limit(options.limit)
            if (options.offset) query.offset(options.offset)

            return query
          })
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

      count: (criterias: Partial<Post>[] = []) =>
        Effect.gen(function* countPosts() {
          const whereClause = buildCriteria(criterias)
          return yield* db.query((client) => client.$count(posts, whereClause))
        }),
    }
  })
)

const buildCriteria = (criterias: Partial<Post>[]): SQL | undefined => {
  if (criterias.length === 0) return

  const orExpressions: (SQL | undefined)[] = []
  for (const criteria of criterias) {
    const andExpressions: SQL[] = []

    for (const [key, value] of Object.entries(criteria))
      andExpressions.push(eq(posts[key as never], value as never))

    if (andExpressions.length > 0)
      orExpressions.push(
        andExpressions.length === 1 ? andExpressions[0] : and(...andExpressions)
      )
  }

  return orExpressions.length === 1 ? orExpressions[0] : or(...orExpressions)
}

const buildSort = (sort: Partial<Record<keyof Post, 'asc' | 'desc'>>) => {
  if (Object.keys(sort).length === 0) return

  return Object.entries(sort).map(([key, order]) => {
    const column = posts[key as never]
    return order === 'asc' ? asc(column) : desc(column)
  })
}
