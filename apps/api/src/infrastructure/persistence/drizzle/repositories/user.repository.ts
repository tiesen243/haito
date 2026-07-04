import { and, eq } from 'drizzle-orm'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { User } from '@/domain/entities/user.entity'
import { UserRepository } from '@/domain/repositories/user.repository'
import { DrizzleClient } from '@/infrastructure/persistence/drizzle/drizzle.client'
import { users } from '@/infrastructure/persistence/drizzle/drizzle.schema'

export const UserRepositoryDrizzle = Layer.effect(
  UserRepository,
  Effect.gen(function* UserRepositoryDrizzle() {
    const db = yield* DrizzleClient

    return {
      findBy: (criterias) =>
        Effect.gen(function* findByFunc() {
          const [user] = yield* db.query((client) =>
            client
              .select()
              .from(users)
              .where(
                and(
                  ...Object.entries(criterias).map(([key, value]) =>
                    eq(users[key as never], value)
                  )
                )
              )
          )

          return user ? new User(user) : null
        }),

      save: (user) => db.query((client) => client.insert(users).values(user)),
    }
  })
)
