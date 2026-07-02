import type { AppModule } from '@/app.module'

import { OAuthModule } from '@/infrastructure/oauth/oauth.module'
import { DrizzlePersistenceModule } from '@/infrastructure/persistence/drizzle/drizzle.module'
import { InMemoryPersistenceModule } from '@/infrastructure/persistence/in-memory/in-memory.module'

export class InfrastructureModule {
  static use(driver: AppModule.Config['persistenceDriver']) {
    const persistenceModule =
      driver === 'in-memory'
        ? InMemoryPersistenceModule
        : DrizzlePersistenceModule

    return {
      persistence: persistenceModule.create(),
      oauth: OAuthModule.create(),
    }
  }
}
