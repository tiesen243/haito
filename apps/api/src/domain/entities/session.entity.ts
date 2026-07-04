import * as Schema from 'effect/Schema'

import type { User } from '@/domain/entities/user.entity'

export const SessionProps = Schema.Struct({
  id: Schema.String,
  token: Schema.String,
  expiresAt: Schema.Date,
  createdAt: Schema.Date,

  userId: Schema.String,
})
export type SessionProps = Schema.Schema.Type<typeof SessionProps>

export class Session extends Schema.Class<Session>('domain/Session')(
  SessionProps
) {
  private _user: User | null = null

  static create(session: Omit<SessionProps, 'createdAt'>): Session {
    return new Session({
      ...session,
      createdAt: new Date(),
    })
  }

  public clone(override: Partial<SessionProps> = {}): Session {
    return new Session({
      ...this,
      ...override,
    })
  }

  get user(): User {
    if (this._user === null) throw new Error('User is not set')
    return this._user
  }

  set user(user: User) {
    this._user = user
  }
}
