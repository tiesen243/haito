import { index, primaryKey, snakeCase, uniqueIndex } from 'drizzle-orm/pg-core'

export const users = snakeCase.table(
  'users',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey(),
    username: t.varchar({ length: 24 }).notNull(),
    email: t.varchar({ length: 255 }).notNull(),
    image: t.varchar({ length: 255 }),

    createdAt: t.timestamp({ mode: 'date' }).notNull(),
    updatedAt: t.timestamp({ mode: 'date' }).notNull(),
    deletedAt: t.timestamp({ mode: 'date' }),
  }),
  (t) => [
    uniqueIndex('users_username_uq_idx').on(t.username),
    uniqueIndex('users_email_uq_idx').on(t.email),
  ]
)

export const accounts = snakeCase.table(
  'accounts',
  (t) => ({
    provider: t.varchar({ length: 24 }).notNull(),
    providerAccountId: t.varchar({ length: 255 }).notNull(),
    password: t.varchar({ length: 255 }),

    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index('accounts_user_id_idx').on(t.userId),
  ]
)

export const sessions = snakeCase.table(
  'sessions',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey(),
    token: t.varchar({ length: 255 }).notNull(),
    expiresAt: t.timestamp({ mode: 'date' }).notNull(),

    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  }),
  (t) => [index('sessions_user_id_idx').on(t.userId)]
)

export const groups = snakeCase.table('groups', (t) => ({
  id: t.varchar({ length: 24 }).primaryKey(),
  name: t.varchar({ length: 255 }).notNull(),
  createdAt: t.timestamp({ mode: 'date' }).notNull(),
  updatedAt: t.timestamp({ mode: 'date' }).notNull(),

  userId: t
    .varchar({ length: 24 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
}))

export const notes = snakeCase.table('notes', (t) => ({
  id: t.varchar({ length: 24 }).primaryKey(),
  title: t.varchar({ length: 255 }).default('Untitled Note'),
  content: t.text().notNull(),
  isPublic: t.boolean().default(false).notNull(),
  createdAt: t.timestamp({ mode: 'date' }).notNull(),
  updatedAt: t.timestamp({ mode: 'date' }).notNull(),
  deletedAt: t.timestamp({ mode: 'date' }),

  userId: t
    .varchar({ length: 24 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  groupId: t
    .varchar({ length: 24 })
    .references(() => groups.id, { onDelete: 'set null' }),
}))
