import type { PostEntity } from '@/domain/entities/post.entity'
import type { PostRepository } from '@/domain/repositories/post.repository'

export class PostRepositoryMemory implements PostRepository {
  private readonly posts: PostEntity[] = []

  find(
    criteria?: Partial<PostEntity>[] | undefined,
    _tx?: unknown
  ): Promise<PostEntity[]> {
    if (!criteria || criteria.length === 0) return Promise.resolve(this.posts)
    return Promise.resolve(
      this.posts.filter((post) =>
        criteria.some((criterion) =>
          Object.entries(criterion).every(
            ([key, value]) => post[key as keyof PostEntity] === value
          )
        )
      )
    )
  }

  one(id: PostEntity['id'], _tx?: unknown): Promise<PostEntity | null> {
    const post = this.posts.find((p) => p.id === id)
    return Promise.resolve(post ?? null)
  }

  insert(entity: PostEntity, _tx?: unknown): Promise<PostEntity['id']> {
    this.posts.push(entity)
    return Promise.resolve(entity.id)
  }

  update(entity: PostEntity, _tx?: unknown): Promise<PostEntity['id']> {
    const index = this.posts.findIndex((p) => p.id === entity.id)
    if (index !== -1) this.posts[index] = entity
    return Promise.resolve(entity.id)
  }

  delete(id: PostEntity['id'], _tx?: unknown): Promise<void> {
    const index = this.posts.findIndex((p) => p.id === id)
    if (index !== -1) this.posts.splice(index, 1)
    return Promise.resolve()
  }
}
