import { snakeCase } from 'drizzle-orm/pg-core'

export const users = snakeCase.table('users', (t) => ({
  id: t.varchar({ length: 24 }).primaryKey(),
  username: t.varchar({ length: 24 }).notNull(),
  email: t.varchar({ length: 255 }).notNull(),
  image: t.varchar({ length: 255 }),

  createdAt: t.timestamp({ mode: 'date' }).notNull(),
  updatedAt: t.timestamp({ mode: 'date' }).notNull(),
  deletedAt: t.timestamp({ mode: 'date' }),
}))
