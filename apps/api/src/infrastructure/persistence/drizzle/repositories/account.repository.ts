import { and, eq } from 'drizzle-orm'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { Account } from '@/domain/entities/account.entity'
import { AccountRepository } from '@/domain/repositories/account.repository'
import { DrizzleClient } from '@/infrastructure/persistence/drizzle/drizzle.client'
import { DrizzleBaseRepository } from '@/infrastructure/persistence/drizzle/repositories/base.repository'

export const DrizzleAccountRepository = Layer.effect(
  AccountRepository,
  Effect.gen(function* DrizzleAccountRepositoryImpl() {
    const { db, $ } = yield* DrizzleClient
    const { accounts } = DrizzleClient.schema

    return {
      ...DrizzleBaseRepository(db, $, Account, accounts as never),

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
            .limit(1)
        ).pipe(Effect.map((rows) => (rows[0] ? new Account(rows[0]) : null))),

      save: (entity) =>
        $(
          db
            .insert(accounts)
            .values(entity.toJSON())
            .onConflictDoUpdate({
              target: [accounts.provider, accounts.providerAccountId],
              set: entity.toJSON(),
            })
        ).pipe(Effect.asVoid),

      delete: (entity) =>
        $(
          db
            .delete(accounts)
            .where(
              and(
                eq(accounts.provider, entity.provider),
                eq(accounts.providerAccountId, entity.providerAccountId)
              )
            )
        ).pipe(Effect.asVoid),
    }
  })
)
