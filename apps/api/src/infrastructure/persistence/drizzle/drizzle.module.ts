import * as Layer from 'effect/Layer'

import { DrizzleClient } from '@/infrastructure/persistence/drizzle/drizzle.client'
import { DrizzleAccountRepository } from '@/infrastructure/persistence/drizzle/repositories/account.repository'
import { DrizzleUserRepository } from '@/infrastructure/persistence/drizzle/repositories/user.repository'

export const InfrastructureDrizzleModule = Layer.mergeAll(
  DrizzleAccountRepository,
  DrizzleUserRepository
).pipe(Layer.provideMerge(DrizzleClient.live))
