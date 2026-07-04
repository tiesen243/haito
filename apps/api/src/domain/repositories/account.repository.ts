import type { Effect } from 'effect/Effect'

import * as Context from 'effect/Context'

import type { Account } from '@/domain/entities/account.entity'
import type { HttpError } from '@/shared/http-error'

export class AccountRepository extends Context.Tag('domain/AccountRepository')<
  AccountRepository,
  {
    readonly findByProvider: (
      provider: Account['provider'],
      providerAccountId: Account['providerAccountId']
    ) => Effect<Account | null, HttpError>

    readonly save: (account: Account) => Effect<void, HttpError>
  }
>() {}
