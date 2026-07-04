import { t } from 'elysia'

export const OAuthQuery = t.Object({
  state: t.Optional(t.String()),
  code: t.Optional(t.String()),
  redirect_uri: t.Optional(t.String({ default: '/' })),
})
export type OAuthQuery = typeof OAuthQuery.static

export const AuthCookie = t.Cookie({
  'auth.state': t.Optional(t.String()),
  'auth.code': t.Optional(t.String()),
  'auth.redirect_uri': t.Optional(t.String()),

  'auth.access_token': t.Optional(t.String()),
  'auth.refresh_token': t.Optional(t.String()),
})
export type AuthCookie = typeof AuthCookie.static
