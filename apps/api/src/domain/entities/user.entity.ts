import * as Schema from 'effect/Schema'

import type { Account } from '@/domain/entities/account.entity'
import type { Session } from '@/domain/entities/session.entity'

import { EntityBase } from '@/domain/abstracts/entity.base'

export const UserProps = Schema.Struct({
  username: Schema.String,
  email: Schema.String,
  image: Schema.NullishOr(Schema.String),
  deletedAt: Schema.NullishOr(Schema.DateFromSelf).pipe(
    Schema.propertySignature,
    Schema.withConstructorDefault(() => null)
  ),
})
export type UserProps = Schema.Schema.Type<typeof UserProps>

export class User extends EntityBase.extend<User>('domain/entity/User')(
  UserProps
) {
  private _accounts: Account[] = []
  private _sessions: Session[] = []

  public get accounts(): Account[] {
    return this._accounts
  }
  public set accounts(accounts: Account[]) {
    this._accounts = accounts
  }

  public get sessions(): Session[] {
    return this._sessions
  }
  public set sessions(sessions: Session[]) {
    this._sessions = sessions
  }
}
