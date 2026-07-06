import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { SessionRepository } from '@/domain/repositories/session.repository'
import { DrizzleClient } from '@/infrastructure/persistence/drizzle/drizzle.client'

export const DrizzleSessionRepository = Layer.effect(
  SessionRepository,
  Effect.gen(function* DrizzleSessionRepositoryImpl() {
    const { db, $ } = yield* DrizzleClient
    const { sessions } = DrizzleClient.schema

    return {
      save: (session) =>
        $(db.insert(sessions).values(session.toJSON())).pipe(Effect.asVoid),
    }
  })
)
