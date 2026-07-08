import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { GroupRepository } from '@/domain/repositories/group.repository'
import { InMemoryClient } from '@/infrastructure/persistence/in-memory/in-memory.client'
import { InMemoryBaseRepository } from '@/infrastructure/persistence/in-memory/repositories/base.repository'

export const InMemoryGroupRepository = Layer.effect(
  GroupRepository,
  Effect.gen(function* InMemoryUserRepositoryImpl() {
    const { groups } = yield* InMemoryClient

    return {
      ...InMemoryBaseRepository(groups),
    }
  })
)
