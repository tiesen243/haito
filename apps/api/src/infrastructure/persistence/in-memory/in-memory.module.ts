import * as Layer from 'effect/Layer'

import { InMemoryClient } from '@/infrastructure/persistence/in-memory/in-memory.client'
import { ImMemoryAccountRepository } from '@/infrastructure/persistence/in-memory/repositories/account.repository'
import { InMemoryUserRepository } from '@/infrastructure/persistence/in-memory/repositories/user.repository'

export const InfrastructureInMemoryModule = Layer.mergeAll(
  ImMemoryAccountRepository,
  InMemoryUserRepository
).pipe(Layer.provideMerge(InMemoryClient.live))
