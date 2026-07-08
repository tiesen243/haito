import * as Layer from 'effect/Layer'

import { DrizzleClient } from '@/infrastructure/persistence/drizzle/drizzle.client'
import { DrizzleAccountRepository } from '@/infrastructure/persistence/drizzle/repositories/account.repository'
import { DrizzleGroupRepository } from '@/infrastructure/persistence/drizzle/repositories/group.repository'
import { DrizzleNoteRepository } from '@/infrastructure/persistence/drizzle/repositories/note.repository'
import { DrizzleSessionRepository } from '@/infrastructure/persistence/drizzle/repositories/session.repository'
import { DrizzleUserRepository } from '@/infrastructure/persistence/drizzle/repositories/user.repository'

export const InfrastructureDrizzleModule = Layer.mergeAll(
  DrizzleAccountRepository,
  DrizzleGroupRepository,
  DrizzleNoteRepository,
  DrizzleSessionRepository,
  DrizzleUserRepository
).pipe(Layer.provideMerge(DrizzleClient.live))
