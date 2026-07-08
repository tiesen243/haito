import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Ref from 'effect/Ref'

import { AccountRepository } from '@/domain/repositories/account.repository'
import { InMemoryClient } from '@/infrastructure/persistence/in-memory/in-memory.client'
import { InMemoryBaseRepository } from '@/infrastructure/persistence/in-memory/repositories/base.repository'

export const InMemoryAccountRepository = Layer.effect(
  AccountRepository,
  Effect.gen(function* ImMemoryAccountRepositoryImpl() {
    const { accounts } = yield* InMemoryClient

    return {
      ...InMemoryBaseRepository(accounts),

      findByProvider: (criteria) =>
        Ref.get(accounts).pipe(
          Effect.map(
            (dict) =>
              dict.get(`${criteria.provider}_${criteria.providerAccountId}`) ??
              null
          )
        ),

      save: (entity) =>
        Ref.update(accounts, (map) =>
          map.set(`${entity.provider}_${entity.providerAccountId}`, entity)
        ).pipe(Effect.asVoid),

      delete: (entity) =>
        Ref.update(accounts, (map) => {
          map.delete(`${entity.provider}_${entity.providerAccountId}`)
          return map
        }).pipe(Effect.asVoid),
    }
  })
)
