import * as Schema from 'effect/Schema'

import type { Group } from '@/domain/entities/group.entity'
import type { User } from '@/domain/entities/user.entity'

import { EntityBase } from '@/domain/abstracts/entity.base'

export const NoteProps = Schema.Struct({
  title: Schema.String,
  content: Schema.String,
  isPublic: Schema.Boolean,
  deletedAt: Schema.NullishOr(Schema.DateFromSelf).pipe(
    Schema.propertySignature,
    Schema.withConstructorDefault(() => null)
  ),

  userId: Schema.String,
  groupId: Schema.NullishOr(Schema.String).pipe(
    Schema.propertySignature,
    Schema.withConstructorDefault(() => null)
  ),
})
export type NoteProps = Schema.Schema.Type<typeof NoteProps>

export class Note extends EntityBase.extend<Note>('domain/entity/Group')(
  NoteProps
) {
  private _user: User | null = null
  private _group: Group | null = null

  public get user(): User {
    if (!this._user) throw new Error('User is not set')
    return this._user
  }
  public set user(user: User) {
    this._user = user
  }

  public get group(): Group | null {
    return this._group
  }
  public set group(group: Group | null) {
    this._group = group
  }
}
