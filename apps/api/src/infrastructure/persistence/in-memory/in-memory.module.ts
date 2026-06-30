import * as Layer from 'effect/Layer'

import { PostRepositoryInMemory } from '@/infrastructure/persistence/in-memory/repositories/post.repository'

export class InMemoryPersistenceModule {
  static create() {
    return Layer.mergeAll(PostRepositoryInMemory)
  }
}
