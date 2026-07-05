import * as Layer from 'effect/Layer'

import { DrizzleClient } from '@/infrastructure/persistence/drizzle/drizzle.client'
import { DrizzleUserRepository } from '@/infrastructure/persistence/drizzle/repositories/user.repository'

export class InfrastructureDrizzleModule {
  static create() {
    return Layer.mergeAll(DrizzleUserRepository).pipe(
      Layer.provideMerge(DrizzleClient.live)
    )
  }
}
