import type { PostEntity } from '@/domain/entities/post.entity'
import type { RepositoryBase } from '@/shared/bases/repository.base'

export interface PostRepository extends RepositoryBase<PostEntity> {}
