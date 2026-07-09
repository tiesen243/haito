import type { RouteConfig } from '@react-router/dev/routes'

import { index, layout, route } from '@react-router/dev/routes'

export default [
  layout('./routes/(main)/__layout.tsx', [
    index('./routes/(main)/_index.tsx'),
    route('/:id', './routes/(main)/[id].tsx'),

    route('/me', './routes/(main)/me/_index.tsx'),
    route('/me/notes', './routes/(main)/me/notes.tsx'),
    route('/me/create', './routes/(main)/me/create.tsx'),
    route('/me/:id', './routes/(main)/me/[id].tsx'),
    route('/me/:id/edit', './routes/(main)/me/[id].edit.tsx'),
  ]),

  layout('./routes/(auth)/__layout.tsx', [
    route('/login', './routes/(auth)/login.tsx'),
  ]),
] satisfies RouteConfig
