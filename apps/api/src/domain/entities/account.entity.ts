import * as Schema from 'effect/Schema'

import type { User } from '@/domain/entities/user.entity'

export const AccountProps = Schema.Struct({
  provider: Schema.String,
  providerAccountId: Schema.String,
  password: Schema.NullishOr(Schema.String),
  userId: Schema.String,
})
export type AccountProps = Schema.Schema.Type<typeof AccountProps>

export class Account extends Schema.Class<Account>('domain/entity/Account')(
  AccountProps
) {
  private _user: User | null = null

  static create(props: AccountProps): Account {
    return new Account(Schema.decodeUnknownSync(AccountProps)(props))
  }

  public clone(props: Partial<AccountProps>): Account {
    const currentProps = structuredClone(this)
    return new Account({ ...currentProps, ...props })
  }

  public toJSON(): AccountProps {
    return structuredClone(this)
  }

  public get user(): User {
    if (this._user === null) throw new Error('User is not set')
    return this._user
  }

  public set user(user: User) {
    this._user = user
  }
}
