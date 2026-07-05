import * as Layer from 'effect/Layer'
import * as Ref from 'effect/Ref'

import type { Session } from '@/domain/entities/session.entity'

import { SessionRepository } from '@/domain/repositories/session.repository'

const store = Ref.unsafeMake<Record<string, Session>>({})

export const SessionRepositoryInMemory = Layer.succeed(SessionRepository, {
  save: (session) =>
    Ref.update(store, (dict) => ({
      ...dict,
      [session.id]: session,
    })),
})
