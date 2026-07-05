import { createId } from '@haito/lib/create-id'
import * as Schema from 'effect/Schema'

import type { Account } from '@/domain/entities/account.entity'
import type { Post } from '@/domain/entities/post.entity'
import type { Session } from '@/domain/entities/session.entity'

export const UserProps = Schema.Struct({
  id: Schema.String,
  username: Schema.String,
  email: Schema.String,
  image: Schema.NullOr(Schema.String),
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
})
export type UserProps = Schema.Schema.Type<typeof UserProps>

export class User extends Schema.Class<User>('domain/entity/User')(UserProps) {
  private _accounts: Account[] = []
  private _sessions: Session[] = []
  private _posts: Post[] = []

  static create(user: Pick<UserProps, 'username' | 'email' | 'image'>): User {
    return new User({
      ...user,
      id: createId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  public clone(override: Partial<UserProps> = {}): User {
    return new User({
      ...this,
      ...override,
      updatedAt: new Date(),
    })
  }

  get accounts(): Account[] {
    return this._accounts
  }

  set accounts(accounts: Account[]) {
    this._accounts = accounts
  }

  get sessions(): Session[] {
    return this._sessions
  }

  set sessions(sessions: Session[]) {
    this._sessions = sessions
  }

  get posts(): Post[] {
    return this._posts
  }

  set posts(posts: Post[]) {
    this._posts = posts
  }
}
