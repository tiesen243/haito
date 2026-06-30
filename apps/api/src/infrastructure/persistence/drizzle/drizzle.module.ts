import * as Layer from 'effect/Layer'

import { DrizzleClient } from '@/infrastructure/persistence/drizzle/drizzle.client'
import { PostRepositoryDrizzle } from '@/infrastructure/persistence/drizzle/repositories/post.repository'

export class DrizzlePersistenceModule {
  static create() {
    return Layer.mergeAll(DrizzleClient.live, PostRepositoryDrizzle).pipe(
      Layer.provide(DrizzleClient.live)
    )
  }
}
