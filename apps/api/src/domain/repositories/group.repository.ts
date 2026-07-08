import * as Context from 'effect/Context'

import type { IRepositoryBase } from '@/domain/abstracts/repository.base'
import type { Group } from '@/domain/entities/group.entity'

// oxlint-disable-next-line typescript/no-empty-interface, typescript/no-empty-object-type
export interface IGroupRepository extends IRepositoryBase<Group> {}

export class GroupRepository extends Context.Tag(
  'domain/repository/GroupRepository'
)<GroupRepository, IGroupRepository>() {}
