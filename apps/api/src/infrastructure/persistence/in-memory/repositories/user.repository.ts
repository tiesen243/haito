import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { UserRepository } from '@/domain/repositories/user.repository'
import { InMemoryClient } from '@/infrastructure/persistence/in-memory/in-memory.client'
import { InMemoryBaseRepository } from '@/infrastructure/persistence/in-memory/repositories/base.repository'

export const InMemoryUserRepository = Layer.effect(
  UserRepository,
  Effect.gen(function* InMemoryUserRepositoryImpl() {
    const { users } = yield* InMemoryClient

    return {
      ...InMemoryBaseRepository(users),
    }
  })
)
