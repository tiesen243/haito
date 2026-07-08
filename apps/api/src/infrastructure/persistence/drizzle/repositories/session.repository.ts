import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { Session } from '@/domain/entities/session.entity'
import { SessionRepository } from '@/domain/repositories/session.repository'
import { DrizzleClient } from '@/infrastructure/persistence/drizzle/drizzle.client'
import { DrizzleBaseRepository } from '@/infrastructure/persistence/drizzle/repositories/base.repository'

export const DrizzleSessionRepository = Layer.effect(
  SessionRepository,
  Effect.gen(function* DrizzleSessionRepositoryImpl() {
    const { db, $ } = yield* DrizzleClient
    const { sessions } = DrizzleClient.schema

    return {
      ...DrizzleBaseRepository(db, $, Session, sessions),
    }
  })
)
