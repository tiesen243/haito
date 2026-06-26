// oxlint-disable class-methods-use-this
import type { PostEntity } from '@/modules/post/domain/post.entity'

import { PostRepository } from '@/modules/post/domain/post.repository'

export class DrizzlePostRepository extends PostRepository {
  override find(): Promise<PostEntity[]> {
    throw new Error('Method not implemented.')
  }

  override findOne(id: PostEntity['id']): Promise<PostEntity | null> {
    throw new Error('Method not implemented.')
  }

  override save(entity: PostEntity): Promise<void> {
    throw new Error('Method not implemented.')
  }

  override delete(id: PostEntity['id']): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
