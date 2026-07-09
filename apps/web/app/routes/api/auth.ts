import { redirect } from 'react-router'

import { api } from '@/lib/api'

import type { Route } from './+types/auth'

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { searchParams } = new URL(request.url)

  const refreshToken = searchParams.get('refresh_token')
  if (!refreshToken) return redirect('/login')

  const { success } = await api.post(
    '/auth/refresh-token',
    {},
    { headers: { Authorization: `Bearer ${refreshToken}` } }
  )

  if (!success) return redirect('/login')
  return redirect('/')
}
