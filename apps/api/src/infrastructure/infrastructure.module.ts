import type { BootstrapConfig } from '@/bootstrap'

import { InfrastructureDrizzleModule } from '@/infrastructure/persistence/drizzle/drizzle.module'
import { InfrastructureInMemoryModule } from '@/infrastructure/persistence/in-memory/in-memory.module'

export class InfrastructureModule {
  static create(infraConfig: Pick<BootstrapConfig, 'persistenceDriver'>) {
    const persistenceModule =
      infraConfig.persistenceDriver === 'in-memory'
        ? InfrastructureInMemoryModule
        : InfrastructureDrizzleModule

    return {
      persistence: persistenceModule,
    }
  }
}
