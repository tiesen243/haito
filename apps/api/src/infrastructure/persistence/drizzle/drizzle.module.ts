import * as Layer from 'effect/Layer'

import {
  Drizzle,
  PgClientLive,
} from '@/infrastructure/persistence/drizzle/drizzle.client'
import { DrizzleUserRepository } from '@/infrastructure/persistence/drizzle/repositories/user.repository'

export class InfrastructureDrizzleModule {
  static create() {
    return Layer.mergeAll(DrizzleUserRepository).pipe(
      Layer.provide(Drizzle.live),
      Layer.provide(PgClientLive)
    )
  }
}
