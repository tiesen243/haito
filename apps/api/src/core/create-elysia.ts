import type { ElysiaConfig } from 'elysia'

import { Elysia } from 'elysia'

import pkgJson from '@/../package.json' with { type: 'json' }

export interface ElysiaContext {
  requestId: string
  requestWith: string
  session: {
    userId: string
    role: string
  } | null
}

export const createElysia = <TPrefix extends string>(
  options: ElysiaConfig<TPrefix>
) =>
  new Elysia({
    ...options,
    name: `${pkgJson.name}.${options.name ?? 'elysia'}`,
  })

    .state('context', {
      requestId: '',
      requestWith: '',
      session: null,
    } as ElysiaContext)
