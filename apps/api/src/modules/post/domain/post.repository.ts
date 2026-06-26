import type { PostEntity } from '@/modules/post/domain/post.entity'

import { RepositoryBase } from '@/core/bases/repository.base'

export abstract class PostRepository extends RepositoryBase<
  PostEntity,
  PostEntity['id']
> {}
