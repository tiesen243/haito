import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { UserRepository } from '@/domain/repositories/user.repository'
import { DrizzleClient } from '@/infrastructure/persistence/drizzle/drizzle.client'

export const DrizzleUserRepository = Layer.effect(
  UserRepository,
  Effect.gen(function* DrizzleUserRepositoryImpl() {
    const { db, $ } = yield* DrizzleClient
    const { users } = DrizzleClient.schema

    return {
      save: (user) =>
        $(db.insert(users).values(user.toJSON())).pipe(Effect.asVoid),
    }
  })
)
