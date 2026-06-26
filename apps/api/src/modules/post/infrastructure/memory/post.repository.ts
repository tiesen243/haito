// oxlint-disable class-methods-use-this
import type { PostEntity } from '@/modules/post/domain/post.entity'

import { PostRepository } from '@/modules/post/domain/post.repository'

export class MemoryPostRepository extends PostRepository {
  private readonly _store = new Map<string, PostEntity>()

  override find(): Promise<PostEntity[]> {
    return Promise.resolve([...this._store.values()])
  }

  override findOne(id: string): Promise<PostEntity | null> {
    const post = this._store.get(id) ?? null
    return Promise.resolve(post)
  }

  override save(entity: PostEntity): Promise<void> {
    this._store.set(entity.id, entity)
    return Promise.resolve()
  }

  override delete(id: string): Promise<void> {
    this._store.delete(id)
    return Promise.resolve()
  }
}
