import * as Context from 'effect/Context'

import type { IRepositoryBase } from '@/domain/abstracts/repository.base'
import type { User } from '@/domain/entities/user.entity'

// oxlint-disable-next-line typescript/no-empty-interface, typescript/no-empty-object-type
export interface IUserRepository extends IRepositoryBase<User> {}

export class UserRepository extends Context.Tag(
  'domain/repository/UserRepository'
)<UserRepository, IUserRepository>() {}
