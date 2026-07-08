import * as Schema from 'effect/Schema'

import type { Note } from '@/domain/entities/note.entity'
import type { User } from '@/domain/entities/user.entity'

import { EntityBase } from '@/domain/abstracts/entity.base'

export const GroupProps = Schema.Struct({
  name: Schema.String,
  userId: Schema.String,
})
export type GroupProps = Schema.Schema.Type<typeof GroupProps>

export class Group extends EntityBase.extend<Group>('domain/entity/Group')(
  GroupProps
) {
  private _user: User | null = null
  private _notes: Note[] = []

  public get user(): User {
    if (!this._user) throw new Error('User is not set')
    return this._user
  }
  public set user(user: User) {
    this._user = user
  }

  public get notes(): Note[] {
    return this._notes
  }
  public set notes(notes: Note[]) {
    this._notes = notes
  }
}
