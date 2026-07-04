import {
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'

const id = varchar({ length: 24 }).primaryKey()
const createdAt = timestamp({ mode: 'date' }).notNull()
const updatedAt = timestamp({ mode: 'date' }).notNull()

export const users = pgTable(
  'users',
  {
    id,
    username: varchar({ length: 50 }).notNull(),
    email: varchar({ length: 100 }).notNull(),
    image: varchar({ length: 255 }),
    createdAt,
    updatedAt,
  },
  (t) => [
    uniqueIndex('users_username_uq_idx').on(t.username),
    uniqueIndex('users_email_uq_idx').on(t.email),
  ]
)

export const accounts = pgTable(
  'accounts',
  {
    provider: varchar({ length: 50 }).notNull(),
    providerAccountId: varchar({ length: 100 }).notNull(),
    password: varchar({ length: 255 }),

    userId: varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index('accounts_userId_idx').on(t.userId),
  ]
)

export const sessions = pgTable(
  'sessions',
  {
    id,
    token: varchar({ length: 64 }).notNull(),
    expiresAt: timestamp({ mode: 'date' }).notNull(),
    createdAt,

    userId: varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (t) => [uniqueIndex('sessions_token_uq_idx').on(t.token)]
)

export const posts = pgTable('posts', {
  id,
  title: varchar({ length: 100 }).notNull(),
  content: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),

  userId: varchar({ length: 24 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})
