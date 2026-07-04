import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { SessionRepository } from '@/domain/repositories/session.repository'
import { DrizzleClient } from '@/infrastructure/persistence/drizzle/drizzle.client'
import { sessions } from '@/infrastructure/persistence/drizzle/drizzle.schema'

export const SessionRepositoryDrizzle = Layer.effect(
  SessionRepository,
  Effect.gen(function* SessionRepositoryDrizzle() {
    const db = yield* DrizzleClient

    return {
      save: (session) =>
        db.query((client) => client.insert(sessions).values(session)),
    }
  })
)
