import * as Layer from 'effect/Layer'

import { InMemoryUserRepository } from '@/infrastructure/persistence/in-memory/repositories/user.repository'

export class InfrastructureInMemoryModule {
  static create() {
    return Layer.mergeAll(InMemoryUserRepository)
  }
}
