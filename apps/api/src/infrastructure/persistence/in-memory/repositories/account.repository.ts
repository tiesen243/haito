import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Ref from 'effect/Ref'

import { AccountRepository } from '@/domain/repositories/account.repository'
import { InMemoryClient } from '@/infrastructure/persistence/in-memory/in-memory.client'

export const ImMemoryAccountRepository = Layer.effect(
  AccountRepository,
  Effect.gen(function* ImMemoryAccountRepositoryImpl() {
    const { accounts, users } = yield* InMemoryClient

    return {
      findByProvider: (criteria) =>
        Effect.gen(function* findByProviderFunc() {
          const account = yield* Ref.get(accounts).pipe(
            Effect.map((dict) =>
              dict.get(`${criteria.provider}_${criteria.providerAccountId}`)
            )
          )
          if (!account) return null

          const user = yield* Ref.get(users).pipe(
            Effect.map((dict) => dict.get(account.userId))
          )
          if (!user) return null

          account.user = user
          return account
        }),

      save: (account) =>
        Ref.update(accounts, (map) =>
          map.set(`${account.provider}_${account.providerAccountId}`, account)
        ).pipe(Effect.asVoid),
    }
  })
)
