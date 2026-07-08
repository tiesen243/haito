import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { SessionRepository } from '@/domain/repositories/session.repository'
import { InMemoryClient } from '@/infrastructure/persistence/in-memory/in-memory.client'
import { InMemoryBaseRepository } from '@/infrastructure/persistence/in-memory/repositories/base.repository'

export const InMemorySessionRepository = Layer.effect(
  SessionRepository,
  Effect.gen(function* ImMemorySessionRepositoryImpl() {
    const { sessions } = yield* InMemoryClient

    return {
      ...InMemoryBaseRepository(sessions),
    }
  })
)
