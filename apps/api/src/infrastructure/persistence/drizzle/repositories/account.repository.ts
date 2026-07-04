import { and, eq } from 'drizzle-orm'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { Account } from '@/domain/entities/account.entity'
import { AccountRepository } from '@/domain/repositories/account.repository'
import { DrizzleClient } from '@/infrastructure/persistence/drizzle/drizzle.client'
import { accounts } from '@/infrastructure/persistence/drizzle/drizzle.schema'

export const AccountRepositoryDrizzle = Layer.effect(
  AccountRepository,
  Effect.gen(function* AccountRepositoryDrizzle() {
    const db = yield* DrizzleClient

    return {
      findByProvider: (provider, providerAccountId) =>
        Effect.gen(function* findByProviderFunc() {
          const [account] = yield* db.query((client) =>
            client
              .select()
              .from(accounts)
              .where(
                and(
                  eq(accounts.provider, provider),
                  eq(accounts.providerAccountId, providerAccountId)
                )
              )
              .limit(1)
          )

          return account ? new Account(account) : null
        }),

      save: (account) =>
        db.query((client) => client.insert(accounts).values(account)),
    }
  })
)
