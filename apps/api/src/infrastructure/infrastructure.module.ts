import type { Config } from '@/shared/config'

import { OAuthModule } from '@/infrastructure/oauth/oauth.module'
import { DrizzlePersistenceModule } from '@/infrastructure/persistence/drizzle/drizzle.module'
import { InMemoryPersistenceModule } from '@/infrastructure/persistence/in-memory/in-memory.module'

export class InfrastructureModule {
  static use(
    driver: Config.Options['persistenceDriver'],
    providers: Config.Options['auth']['providers']
  ) {
    const persistenceModule =
      driver === 'in-memory'
        ? InMemoryPersistenceModule
        : DrizzlePersistenceModule

    return {
      persistence: persistenceModule.create(),
      oauth: OAuthModule.create(providers),
    }
  }
}
