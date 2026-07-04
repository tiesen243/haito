import { createId } from '@haito/lib/create-id'
import * as Schema from 'effect/Schema'

import type { User } from '@/domain/entities/user.entity'

export const PostProps = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  content: Schema.String,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,

  userId: Schema.String,
})
export type PostProps = Schema.Schema.Type<typeof PostProps>

export class Post extends Schema.Class<Post>('domain/Post')(PostProps) {
  private _author: User | null = null

  static create(post: Pick<PostProps, 'title' | 'content' | 'userId'>): Post {
    return new Post({
      ...post,
      id: createId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  public clone(override: Partial<PostProps> = {}): Post {
    return new Post({
      ...this,
      ...override,
      updatedAt: new Date(),
    })
  }

  get author(): User {
    if (this._author === null) throw new Error('Author is not set')
    return this._author
  }

  set author(author: User) {
    this._author = author
  }
}
