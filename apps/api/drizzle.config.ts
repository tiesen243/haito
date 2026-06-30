import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/infrastructure/persistence/drizzle/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgres://postgres:secret@127.0.0.1:5432/db',
  },
  casing: 'snake_case',
})
