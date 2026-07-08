import * as Schema from 'effect/Schema'

import type { User } from '@/domain/entities/user.entity'

import { EntityBase } from '@/domain/abstracts/entity.base'

export class Session extends EntityBase.extend<Session>(
  'domain/entity/Session'
)({
  token: Schema.String,
  expiresAt: Schema.DateFromSelf,
  userId: Schema.String,
}) {
  private _user: User | null = null

  get user(): User {
    if (this._user === null) throw new Error('User is not set')
    return this._user
  }
  set user(user: User) {
    this._user = user
  }
}
