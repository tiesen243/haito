import type * as Effect from 'effect/Effect'

import * as Context from 'effect/Context'

import type { IRepositoryBase } from '@/domain/abstracts/repository.base'
import type { Account } from '@/domain/entities/account.entity'
import type { HttpError } from '@/shared/http-error'

export interface IAccountRepository extends IRepositoryBase<Account> {
  findByProvider: (
    criteria: Pick<Account, 'provider' | 'providerAccountId'>
  ) => Effect.Effect<Account | null, HttpError>
}

export class AccountRepository extends Context.Tag(
  'domain/repository/AccountRepository'
)<AccountRepository, IAccountRepository>() {}
