import { createId } from '@haito/lib/create-id'
import * as Schema from 'effect/Schema'

export class Post extends Schema.Class<Post>('Post')({
  id: Schema.String,
  title: Schema.String,
  content: Schema.String,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
}) {
  static create(post: Pick<Post, 'title' | 'content'>): Post {
    return new Post({
      ...post,
      id: createId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}
