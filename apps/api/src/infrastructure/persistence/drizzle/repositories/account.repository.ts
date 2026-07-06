import { and, eq } from 'drizzle-orm'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { Account } from '@/domain/entities/account.entity'
import { User } from '@/domain/entities/user.entity'
import { AccountRepository } from '@/domain/repositories/account.repository'
import { DrizzleClient } from '@/infrastructure/persistence/drizzle/drizzle.client'

export const DrizzleAccountRepository = Layer.effect(
  AccountRepository,
  Effect.gen(function* DrizzleAccountRepositoryImpl() {
    const { db, $ } = yield* DrizzleClient
    const { accounts, users } = DrizzleClient.schema

    return {
      findByProvider: (criteria) =>
        $(
          db
            .select()
            .from(accounts)
            .where(
              and(
                eq(accounts.provider, criteria.provider),
                eq(accounts.providerAccountId, criteria.providerAccountId)
              )
            )
            .innerJoin(users, eq(accounts.userId, users.id))
            .limit(1)
        ).pipe(
          Effect.map((rows) => {
            if (!rows[0]) return null
            const account = new Account(rows[0].accounts)
            account.user = new User(rows[0].users)
            return account
          })
        ),

      save: (account) =>
        $(db.insert(accounts).values(account.toJSON())).pipe(Effect.asVoid),
    }
  })
)
