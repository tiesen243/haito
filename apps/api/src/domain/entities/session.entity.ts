import * as Schema from 'effect/Schema'

import type { User } from '@/domain/entities/user.entity'

export const SessionProps = Schema.Struct({
  id: Schema.String,
  token: Schema.String,
  expiresAt: Schema.DateFromSelf,
  userId: Schema.String,
})
export type SessionProps = Schema.Schema.Type<typeof SessionProps>

export class Session extends Schema.Class<Session>('domain/entity/Session')(
  SessionProps
) {
  private _user: User | null = null

  static create(props: SessionProps): Session {
    return new Session(Schema.decodeUnknownSync(SessionProps)(props))
  }

  public clone(props: Partial<SessionProps>): Session {
    const currentProps = structuredClone(this)
    return new Session({ ...currentProps, ...props })
  }

  public toJSON(): SessionProps {
    return structuredClone(this)
  }

  get user(): User {
    if (this._user === null) throw new Error('User is not set')
    return this._user
  }
  set user(user: User) {
    this._user = user
  }
}
