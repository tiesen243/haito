import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Ref from 'effect/Ref'

import { SessionRepository } from '@/domain/repositories/session.repository'
import { InMemoryClient } from '@/infrastructure/persistence/in-memory/in-memory.client'

export const InMemorySessionRepository = Layer.effect(
  SessionRepository,
  Effect.gen(function* ImMemorySessionRepositoryImpl() {
    const { sessions } = yield* InMemoryClient

    return {
      save: (session) =>
        Ref.update(sessions, (map) => map.set(session.token, session)).pipe(
          Effect.asVoid
        ),
    }
  })
)
