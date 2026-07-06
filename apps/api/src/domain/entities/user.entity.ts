import { createId } from '@haito/lib/create-id'
import * as Schema from 'effect/Schema'

import type { Account } from '@/domain/entities/account.entity'
import type { Session } from '@/domain/entities/session.entity'

export const UserProps = Schema.Struct({
  id: Schema.String,
  username: Schema.String,
  email: Schema.String,
  image: Schema.NullishOr(Schema.String),
  createdAt: Schema.DateFromSelf,
  updatedAt: Schema.DateFromSelf,
  deletedAt: Schema.NullishOr(Schema.DateFromSelf),
})
export type UserProps = Schema.Schema.Type<typeof UserProps>

export class User extends Schema.Class<User>('domain/entity/User')(UserProps) {
  private _accounts: Account[] = []
  private _sessions: Session[] = []

  static create(props: Pick<UserProps, 'username' | 'email' | 'image'>): User {
    const now = new Date()

    return new User(
      Schema.decodeUnknownSync(UserProps)({
        ...props,
        id: createId(),
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      })
    )
  }

  public clone(props: Partial<UserProps>): User {
    const currentProps = structuredClone(this)
    return new User({ ...currentProps, ...props, updatedAt: new Date() })
  }

  public toJSON(): UserProps {
    return structuredClone(this)
  }

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
