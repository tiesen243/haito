import type { Column, SQL } from 'drizzle-orm'
import type { AnyPgTable } from 'drizzle-orm/pg-core'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  lt,
  lte,
  or,
} from 'drizzle-orm'
import * as Effect from 'effect/Effect'

import type { EntityBase } from '@/domain/abstracts/entity.base'
import type { IRepositoryBase } from '@/domain/abstracts/repository.base'
import type { HttpError } from '@/shared/http-error'

export const DrizzleBaseRepository = <TEntity extends EntityBase>(
  db: PostgresJsDatabase,
  $: <T>(query: PromiseLike<T>) => Effect.Effect<T, HttpError>,
  // oxlint-disable-next-line typescript/no-explicit-any
  entityConstructor: new (...args: any[]) => TEntity,
  table: AnyPgTable & { id: Column }
) =>
  ({
    find: (criterias, orderBy, options) =>
      Effect.gen(function* findFunc() {
        const query = db.select().from(table).$dynamic()

        if (criterias) {
          const whereClause = buildWhereClause<TEntity>(table, criterias)
          query.where(whereClause)
        }

        if (orderBy) {
          const orderByClause = buildOrderByClause<TEntity>(table, orderBy)
          query.orderBy(...orderByClause)
        }

        if (options?.limit) query.limit(options.limit)
        if (options?.offset) query.offset(options.offset)

        return yield* $(query).pipe(
          Effect.map((rows) => rows.map((row) => new entityConstructor(row)))
        )
      }),

    count: (_criterias) => $(db.$count(table)),

    save: (entity) =>
      $(db.insert(table).values(entity.toJSON())).pipe(Effect.asVoid),

    delete: (entity) =>
      $(db.delete(table).where(eq(table.id, entity.id))).pipe(Effect.asVoid),
  }) satisfies IRepositoryBase<TEntity>

export function buildWhereClause<TEntity>(
  table: AnyPgTable,
  criterias: IRepositoryBase.Criteria<TEntity>[]
): SQL | undefined {
  if (criterias.length === 0) return undefined

  const orClauses: SQL[] = []

  for (const criteria of criterias) {
    const andClauses: SQL[] = []

    for (const [key, condition] of Object.entries(criteria)) {
      const column = table[key as keyof typeof table] as unknown as Column
      if (!column) continue

      if (condition !== null && typeof condition === 'object') {
        const operator = condition as IRepositoryBase.Operator<TEntity>

        if ('$gt' in operator) andClauses.push(gt(column, operator.$gt))
        if ('$gte' in operator) andClauses.push(gte(column, operator.$gte))
        if ('$lt' in operator) andClauses.push(lt(column, operator.$lt))
        if ('$lte' in operator) andClauses.push(lte(column, operator.$lte))
        if ('$in' in operator)
          andClauses.push(inArray(column, operator.$in as never))
        if ('$like' in operator) {
          const mode = operator.mode ?? 'contains'
          let value = operator.$like
          if (mode === 'startsWith') value = `${value}%`
          else if (mode === 'endsWith') value = `%${value}`
          else value = `%${value}%`

          andClauses.push(ilike(column, value))
        }
      } else andClauses.push(eq(column, condition))
    }

    if (andClauses.length > 0) orClauses.push(and(...andClauses) as never)
  }

  if (orClauses.length === 0) return undefined
  return orClauses.length === 1 ? orClauses[0] : or(...orClauses)
}

export function buildOrderByClause<TEntity>(
  table: AnyPgTable,
  orderBy: Partial<Record<keyof TEntity, 'asc' | 'desc'>>
): SQL[] {
  if (!orderBy || Object.keys(orderBy).length === 0) return []

  const orderByClauses: SQL[] = []

  for (const [key, direction] of Object.entries(orderBy)) {
    const column = table[key as keyof typeof table] as unknown as Column
    if (!column) continue

    if (direction === 'asc') orderByClauses.push(asc(column))
    else if (direction === 'desc') orderByClauses.push(desc(column))
  }

  return orderByClauses
}
