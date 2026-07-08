import * as Schema from 'effect/Schema'

import type { User } from '@/domain/entities/user.entity'

import { EntityBase } from '@/domain/abstracts/entity.base'

export class Account extends EntityBase.extend<Account>(
  'domain/entity/Account'
)({
  provider: Schema.String,
  providerAccountId: Schema.String,
  password: Schema.NullishOr(Schema.String),
  userId: Schema.String,
}) {
  private _user: User | null = null

  public get user(): User {
    if (this._user === null) throw new Error('User is not set')
    return this._user
  }

  public set user(user: User) {
    this._user = user
  }
}
