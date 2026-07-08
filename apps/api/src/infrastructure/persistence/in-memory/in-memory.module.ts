import * as Layer from 'effect/Layer'

import { InMemoryClient } from '@/infrastructure/persistence/in-memory/in-memory.client'
import { InMemoryAccountRepository } from '@/infrastructure/persistence/in-memory/repositories/account.repository'
import { InMemoryGroupRepository } from '@/infrastructure/persistence/in-memory/repositories/group.repository'
import { InMemoryNoteRepository } from '@/infrastructure/persistence/in-memory/repositories/note.repository'
import { InMemorySessionRepository } from '@/infrastructure/persistence/in-memory/repositories/session.repository'
import { InMemoryUserRepository } from '@/infrastructure/persistence/in-memory/repositories/user.repository'

export const InfrastructureInMemoryModule = Layer.mergeAll(
  InMemoryAccountRepository,
  InMemoryGroupRepository,
  InMemoryNoteRepository,
  InMemorySessionRepository,
  InMemoryUserRepository
).pipe(Layer.provideMerge(InMemoryClient.live))
