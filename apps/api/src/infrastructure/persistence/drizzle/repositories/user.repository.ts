import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { User } from '@/domain/entities/user.entity'
import { UserRepository } from '@/domain/repositories/user.repository'
import { DrizzleClient } from '@/infrastructure/persistence/drizzle/drizzle.client'
import { DrizzleBaseRepository } from '@/infrastructure/persistence/drizzle/repositories/base.repository'

export const DrizzleUserRepository = Layer.effect(
  UserRepository,
  Effect.gen(function* DrizzleUserRepositoryImpl() {
    const { db, $ } = yield* DrizzleClient
    const { users } = DrizzleClient.schema

    return {
      ...DrizzleBaseRepository(db, $, User, users),
    }
  })
)
