import { PgClient } from '@effect/sql-pg'
import * as PgDrizzle from 'drizzle-orm/effect-postgres'
import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Redacted from 'effect/Redacted'
import { types } from 'pg'

import * as schema from '@/infrastructure/persistence/drizzle/drizzle.schema'
import { env } from '@/shared/env'

export const PgClientLive = PgClient.layer({
  url: Redacted.make(env.DATABASE_URL),
  types: {
    getTypeParser: (typeId, format) => {
      if (
        [1184, 1114, 1082, 1186, 1231, 1115, 1185, 1187, 1182].includes(typeId)
      )
        return (val: unknown) => val

      return types.getTypeParser(typeId, format)
    },
  },
})

const DrizzleEffect = PgDrizzle.make().pipe(
  Effect.provide(PgDrizzle.DefaultServices)
)

export class Drizzle extends Context.Tag('infrastructure/persistence/drizzle')<
  Drizzle,
  Effect.Effect.Success<typeof DrizzleEffect>
>() {
  static live = Layer.effect(Drizzle, DrizzleEffect)
  static schema = schema
}
