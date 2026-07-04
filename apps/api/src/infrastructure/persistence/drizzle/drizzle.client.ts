import type { PgTransaction } from 'drizzle-orm/pg-core'
import type {
  PostgresJsDatabase,
  PostgresJsQueryResultHKT,
} from 'drizzle-orm/postgres-js'

import { drizzle } from 'drizzle-orm/postgres-js'
import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import postgres from 'postgres'

import { HttpError } from '@/shared/http-error'
import { env } from '@/shared/lib/env'

interface DrizzleClientProps {
  client: PostgresJsDatabase
  readonly query: <T>(
    cb: (client: PostgresJsDatabase) => Promise<T>
  ) => Effect.Effect<T, HttpError, never>
  readonly withClient: (
    overrideClient: PostgresJsDatabase | PgTransaction<PostgresJsQueryResultHKT>
  ) => DrizzleClientProps
}

const make = (client: PostgresJsDatabase) => ({
  client,
  query: <T>(cbk: (client: PostgresJsDatabase) => Promise<T>) =>
    Effect.tryPromise({
      try: (_) => cbk(client),
      catch: (error) =>
        HttpError.internalServerError('Database query failed', error),
    }),
  withClient: (overrideClient: PostgresJsDatabase) => make(overrideClient),
})

export class DrizzleClient extends Context.Tag('DrizzleClient')<
  DrizzleClient,
  DrizzleClientProps
>() {
  static live = Layer.succeed(
    this,
    (() => {
      const conn = postgres({
        host: env.POSTGRES_HOST,
        port: env.POSTGRES_PORT,
        user: env.POSTGRES_USER,
        password: env.POSTGRES_PASSWORD,
        database: env.POSTGRES_DB,
      })
      const db = drizzle(conn, { casing: 'snake_case' })

      return make(db)
    })()
  )
}
