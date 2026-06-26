import type { AppModule } from '@/app.module'
import type { AnyClass } from '@/core/types'

import { DrizzlePostRepository } from '@/modules/post/infrastructure/drizzle/post.repository'
import { MemoryPostRepository } from '@/modules/post/infrastructure/memory/post.repository'

// oxlint-disable-next-line unicorn/no-static-only-class typescript/no-extraneous-class
export class PostInfrastructure {
  static use(driver: AppModule.Config['persistanceDriver']): AnyClass {
    switch (driver) {
      case 'memory':
        return MemoryPostRepository
      case 'drizzle':
        return DrizzlePostRepository
      default:
        throw new Error(`Unknown persistance driver: ${driver}`)
    }
  }
}
