import { t } from 'elysia'
import * as z from 'zod'

export const AuthSchema = {
  headers: t.Object({
    authorization: t.Optional(t.String()),
  }),

  cookie: t.Cookie({
    'auth.access_token': t.Optional(t.String()),
    'auth.refresh_token': t.Optional(t.String()),

    // OAuth stuffs
    'auth.state': t.Optional(t.String()),
    'auth.code': t.Optional(t.String()),
    'auth.redirect_uri': t.Optional(t.String()),
  }),

  query: t.Object({
    state: t.Optional(t.String()),
    code: t.Optional(t.String()),
    redirect_uri: t.Optional(t.String()),
  }),
}

export const baseSchema = z.object({
  id: z.cuid2(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type BaseSchema = z.infer<typeof baseSchema>

export namespace PaginationSchema {
  export const input = z.object({
    page: z.coerce.number().int().default(1),
    limit: z.coerce.number().int().default(10),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    page: z.number().int(),
    pageSize: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  })
  export type Output = z.infer<typeof output>
}
