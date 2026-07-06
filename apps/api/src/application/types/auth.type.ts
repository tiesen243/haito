import { t } from 'elysia'

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

export type AuthSchema = typeof AuthSchema
