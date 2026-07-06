import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Ref from 'effect/Ref'

import { AccountRepository } from '@/domain/repositories/account.repository'
import { InMemoryClient } from '@/infrastructure/persistence/in-memory/in-memory.client'

export const InMemoryAccountRepository = Layer.effect(
  AccountRepository,
  Effect.gen(function* ImMemoryAccountRepositoryImpl() {
    const { accounts } = yield* InMemoryClient

    return {
      findByProvider: (criteria) =>
        Ref.get(accounts).pipe(
          Effect.map(
            (dict) =>
              dict.get(`${criteria.provider}_${criteria.providerAccountId}`) ??
              null
          )
        ),

      save: (account) =>
        Ref.update(accounts, (map) =>
          map.set(`${account.provider}_${account.providerAccountId}`, account)
        ).pipe(Effect.asVoid),
    }
  })
)
