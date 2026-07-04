import * as Schema from 'effect/Schema'

import type { User } from '@/domain/entities/user.entity'
import type { Optional } from '@/shared/types'

export const AccountProps = Schema.Struct({
  provider: Schema.String,
  providerAccountId: Schema.String,
  password: Schema.NullOr(Schema.String),

  userId: Schema.String,
})
export type AccountProps = Schema.Schema.Type<typeof AccountProps>

export class Account extends Schema.Class<Account>('domain/Account')(
  AccountProps
) {
  private _user: User | null = null

  static create(account: Optional<AccountProps, 'password'>): Account {
    return new Account({
      password: null,
      ...account,
    })
  }

  public clone(override: Partial<AccountProps> = {}): Account {
    return new Account({ ...this, ...override })
  }

  get user(): User {
    if (this._user === null) throw new Error('User is not set')
    return this._user
  }

  set user(user: User) {
    this._user = user
  }
}
