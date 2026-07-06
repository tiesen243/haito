import type { BootstrapConfig } from '@/bootstrap'

import { InfrastructureOAuthModule } from '@/infrastructure/oauth/oauth.module'
import { InfrastructureDrizzleModule } from '@/infrastructure/persistence/drizzle/drizzle.module'
import { InfrastructureInMemoryModule } from '@/infrastructure/persistence/in-memory/in-memory.module'

export class InfrastructureModule {
  static create(
    infraConfig: Pick<BootstrapConfig, 'persistenceDriver' | 'providers'>
  ) {
    const persistenceModule =
      infraConfig.persistenceDriver === 'in-memory'
        ? InfrastructureInMemoryModule
        : InfrastructureDrizzleModule

    return {
      persistence: persistenceModule,
      oauth: InfrastructureOAuthModule.create(infraConfig.providers),
    }
  }
}
