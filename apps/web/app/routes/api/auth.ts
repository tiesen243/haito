import { redirect } from 'react-router'

import type { Route } from './+types/auth'

export const loader = ({ request }: Route.LoaderArgs) => {
  const { searchParams } = new URL(request.url)

  const access_token = searchParams.get('access_token') ?? ''
  const refresh_token = searchParams.get('refresh_token') ?? ''

  if (!access_token || !refresh_token) return redirect('/login')

  const headers = new Headers()
  headers.append(
    'Set-Cookie',
    `access_token=${access_token}; Path=/; HttpOnly; SameSite=None; Secure`
  )
  headers.append(
    'Set-Cookie',
    `refresh_token=${refresh_token}; Path=/; HttpOnly; SameSite=None; Secure`
  )

  return redirect('/', { headers })
}
