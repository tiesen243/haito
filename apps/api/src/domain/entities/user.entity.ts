import { createId } from '@haito/lib/create-id'
import * as Schema from 'effect/Schema'

export const UserProps = Schema.Struct({
  id: Schema.String,
  username: Schema.String,
  email: Schema.String,
  image: Schema.NullishOr(Schema.String),
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
  deletedAt: Schema.NullishOr(Schema.Date),
})
export type UserProps = Schema.Schema.Type<typeof UserProps>

export class User extends Schema.Class<User>('domain/entity/User')(UserProps) {
  static create(props: Pick<UserProps, 'username' | 'email' | 'image'>) {
    const now = new Date()
    return new User({
      ...props,
      id: createId(),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    })
  }
}
