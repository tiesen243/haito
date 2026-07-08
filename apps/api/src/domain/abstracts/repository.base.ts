import type * as Effect from 'effect/Effect'

import type { EntityBase } from '@/domain/abstracts/entity.base'
import type { HttpError } from '@/shared/http-error'

export interface IRepositoryBase<TEntity extends EntityBase> {
  find: (
    criterias?: IRepositoryBase.Criteria<TEntity>[],
    orderBy?: Partial<Record<keyof TEntity, 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number }
  ) => Effect.Effect<TEntity[], HttpError>

  count: (
    criterias?: IRepositoryBase.Criteria<TEntity>[]
  ) => Effect.Effect<number, HttpError>

  save: (entity: TEntity) => Effect.Effect<void, HttpError>

  delete: (entity: TEntity) => Effect.Effect<void, HttpError>
}

export namespace IRepositoryBase {
  export type Criteria<T> = Partial<Record<keyof T, Operator<T> | string>>

  export type Operator<T> =
    | { $gt?: T[keyof T] }
    | { $gte?: T[keyof T] }
    | { $lt?: T[keyof T] }
    | { $lte?: T[keyof T] }
    | { $in?: T[keyof T][] }
    | {
        $like?: string
        mode?: 'startsWith' | 'endsWith' | 'contains'
      }
}
