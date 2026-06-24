import { PostEntity } from '@/modules/post/domain/post.entity'

export class PostService {
  private posts: PostEntity[] = []

  public all(): PostEntity[] {
    return this.posts
  }

  public one(id: PostEntity['id']): PostEntity | null {
    return this.posts.find((p) => p.id === id) ?? null
  }

  public create(post: { title: string; content: string }): void {
    const newPost = PostEntity.create(post)
    this.posts.push(newPost)
  }

  public update(
    id: PostEntity['id'],
    data: Pick<PostEntity, 'title' | 'content'>
  ): void {
    const post = this.one(id)
    if (!post) throw new Error(`Post with ID ${id} not found`)

    const updatedPost = post.clone(data)
    this.posts = this.posts.map((p) => (p.id === id ? updatedPost : p))
  }

  public delete(id: PostEntity['id']): void {
    const post = this.one(id)
    if (!post) throw new Error(`Post with ID ${id} not found`)

    this.posts = this.posts.filter((p) => p.id !== id)
  }
}
