import * as Layer from 'effect/Layer'

import { DrizzleClient } from '@/infrastructure/persistence/drizzle/drizzle.client'
import { AccountRepositoryDrizzle } from '@/infrastructure/persistence/drizzle/repositories/account.repository'
import { PostRepositoryDrizzle } from '@/infrastructure/persistence/drizzle/repositories/post.repository'
import { SessionRepositoryDrizzle } from '@/infrastructure/persistence/drizzle/repositories/session.repository'
import { UserRepositoryDrizzle } from '@/infrastructure/persistence/drizzle/repositories/user.repository'

export class DrizzlePersistenceModule {
  static create() {
    return Layer.mergeAll(
      DrizzleClient.live,
      AccountRepositoryDrizzle,
      PostRepositoryDrizzle,
      SessionRepositoryDrizzle,
      UserRepositoryDrizzle
    ).pipe(Layer.provide(DrizzleClient.live))
  }
}
