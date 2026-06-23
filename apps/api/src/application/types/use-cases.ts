import type {
  CreatePostModel,
  ListPostsModel,
  OnePostModel,
} from '@haito/validators/models/post'

import type { UseCaseBase } from '@/shared/bases/use-case.base'

export interface PostUseCases {
  list: UseCaseBase<ListPostsModel.Input, ListPostsModel.Output>
  one: UseCaseBase<OnePostModel.Input, OnePostModel.Output>
  create: UseCaseBase<CreatePostModel.Input, CreatePostModel.Output>
  update: UseCaseBase<
    OnePostModel.Input & CreatePostModel.Input,
    CreatePostModel.Output
  >
  delete: UseCaseBase<OnePostModel.Input, OnePostModel.Output>
}
