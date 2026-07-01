import { createId } from '@haito/lib/create-id'
import * as Schema from 'effect/Schema'

export const PostProps = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  content: Schema.String,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
})
export type PostProps = Schema.Schema.Type<typeof PostProps>

export class Post extends Schema.Class<Post>('Post')(PostProps) {
  static create(post: Pick<PostProps, 'title' | 'content'>): Post {
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
}
