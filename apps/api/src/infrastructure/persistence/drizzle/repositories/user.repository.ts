import { and, eq } from 'drizzle-orm'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { User } from '@/domain/entities/user.entity'
import { UserRepository } from '@/domain/repositories/user.repository'
import { DrizzleClient } from '@/infrastructure/persistence/drizzle/drizzle.client'

export const DrizzleUserRepository = Layer.effect(
  UserRepository,
  Effect.gen(function* DrizzleUserRepositoryImpl() {
    const { db, $ } = yield* DrizzleClient
    const { users } = DrizzleClient.schema

    return {
      findBy: (criteria) =>
        $(
          db
            .select()
            .from(users)
            .where(
              and(
                ...Object.entries(criteria).map(([key, value]) =>
                  eq(users[key as never], value)
                )
              )
            )
            .limit(1)
        ).pipe(Effect.map((rows) => (rows[0] ? new User(rows[0]) : null))),

      save: (user) =>
        $(db.insert(users).values(user.toJSON())).pipe(Effect.asVoid),
    }
  })
)
