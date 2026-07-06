import type * as Effect from 'effect/Effect'

import * as Context from 'effect/Context'

import type { Account } from '@/domain/entities/account.entity'
import type { HttpError } from '@/shared/http-error'

export class AccountRepository extends Context.Tag(
  'domain/repository/AccountRepository'
)<
  AccountRepository,
  {
    findByProvider: (
      criteria: Pick<Account, 'provider' | 'providerAccountId'>
    ) => Effect.Effect<Account | null, HttpError>

    save: (account: Account) => Effect.Effect<void, HttpError>
  }
>() {}
