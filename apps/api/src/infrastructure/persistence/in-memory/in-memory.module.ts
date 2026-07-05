import * as Layer from 'effect/Layer'

import { AccountRepositoryInMemory } from '@/infrastructure/persistence/in-memory/repositories/account.repository'
import { PostRepositoryInMemory } from '@/infrastructure/persistence/in-memory/repositories/post.repository'
import { SessionRepositoryInMemory } from '@/infrastructure/persistence/in-memory/repositories/session.repository'
import { UserRepositoryInMemory } from '@/infrastructure/persistence/in-memory/repositories/user.repository'

export class InMemoryPersistenceModule {
  public static create() {
    return Layer.mergeAll(
      AccountRepositoryInMemory,
      PostRepositoryInMemory,
      SessionRepositoryInMemory,
      UserRepositoryInMemory
    )
  }
}
