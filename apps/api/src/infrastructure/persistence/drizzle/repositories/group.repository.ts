import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { Group } from '@/domain/entities/group.entity'
import { GroupRepository } from '@/domain/repositories/group.repository'
import { DrizzleClient } from '@/infrastructure/persistence/drizzle/drizzle.client'
import { DrizzleBaseRepository } from '@/infrastructure/persistence/drizzle/repositories/base.repository'

export const DrizzleGroupRepository = Layer.effect(
  GroupRepository,
  Effect.gen(function* DrizzleUserRepositoryImpl() {
    const { db, $ } = yield* DrizzleClient
    const { groups } = DrizzleClient.schema

    return {
      ...DrizzleBaseRepository(db, $, Group, groups),
    }
  })
)
