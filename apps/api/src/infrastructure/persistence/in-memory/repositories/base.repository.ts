import * as Effect from 'effect/Effect'
import * as Ref from 'effect/Ref'

import type { EntityBase } from '@/domain/abstracts/entity.base'
import type { IRepositoryBase } from '@/domain/abstracts/repository.base'

export const InMemoryBaseRepository = <TKey, TEntity extends EntityBase>(
  table: Ref.Ref<Map<TKey, TEntity>>
) =>
  ({
    find: (criterias, orderBy, options) =>
      Ref.get(table).pipe(
        Effect.map((map) => [...map.values()]),
        Effect.map((list) => filterEntities(list, criterias)),
        Effect.map((list) => buildOrderByClause(list, orderBy)),
        Effect.map((list) => {
          const offset = options?.offset ?? 0
          const limit = options?.limit
          return limit === undefined
            ? list.slice(offset)
            : list.slice(offset, offset + limit)
        })
      ),

    count: (criterias) =>
      Ref.get(table).pipe(
        Effect.map((map) => [...map.values()]),
        Effect.map((list) => filterEntities(list, criterias)),
        Effect.map((list) => list.length)
      ),

    save: (entity) =>
      Ref.update(table, (map) => map.set(entity.id as TKey, entity)).pipe(
        Effect.asVoid
      ),

    delete: (entity) =>
      Ref.update(table, (map) => {
        map.delete(entity.id as TKey)
        return map
      }).pipe(Effect.asVoid),
  }) satisfies IRepositoryBase<TEntity>

// oxlint-disable-next-line complexity
function buildCriteria<TEntity>(
  entity: TEntity,
  criteria: IRepositoryBase.Criteria<TEntity>
): boolean {
  for (const [key, value] of Object.entries(criteria)) {
    const entityValue = entity[key as keyof TEntity]

    if (value !== null && typeof value === 'object' && !('_brand' in value)) {
      const ops = value as IRepositoryBase.Operator<TEntity>

      if ('$lt' in ops && ops.$lt) return value < ops.$lt
      if ('$lte' in ops && ops.$lte) return value <= ops.$lte
      if ('$gt' in ops && ops.$gt) return value > ops.$gt
      if ('$gte' in ops && ops.$gte) return value >= ops.$gte

      if (
        '$in' in ops &&
        Array.isArray(ops.$in) &&
        !ops.$in.includes(entityValue)
      )
        return false

      if ('$isNull' in ops) {
        if (ops.$isNull && entityValue !== null) return false
        if (!ops.$isNull && entityValue === null) return false
      }

      if ('$like' in ops && ops.$like !== undefined) {
        const searchStr = String(ops.$like).toLowerCase()
        const currentStr = String(entityValue).toLowerCase()
        const mode = ops.mode || 'contains'

        if (mode === 'startsWith' && !currentStr.startsWith(searchStr))
          return false
        if (mode === 'endsWith' && !currentStr.endsWith(searchStr)) return false
        if (mode === 'contains' && !currentStr.includes(searchStr)) return false
      }
    } else if (entityValue !== value) return false
  }

  return true
}

function filterEntities<TEntity>(
  entities: TEntity[],
  criterias?: IRepositoryBase.Criteria<TEntity>[]
): TEntity[] {
  if (!criterias || criterias.length === 0) return entities

  return entities.filter((entity) =>
    criterias.some((criteria) => buildCriteria(entity, criteria))
  )
}

function buildOrderByClause<TEntity>(
  entities: TEntity[],
  orderBy?: Partial<Record<keyof TEntity, 'asc' | 'desc'>>
): TEntity[] {
  if (!orderBy || Object.keys(orderBy).length === 0) return entities

  return [...entities].toSorted((a, b) => {
    for (const [key, direction] of Object.entries(orderBy)) {
      const aValue = a[key as keyof TEntity]
      const bValue = b[key as keyof TEntity]
      if (aValue === bValue) continue

      if (direction === 'asc') return aValue < bValue ? -1 : 1
      if (direction === 'desc') return aValue > bValue ? -1 : 1
    }

    return 0
  })
}
