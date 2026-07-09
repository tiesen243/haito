import { CardHeader, CardTitle } from '@haito/ui/card'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { api } from '@/lib/api'

export default function AuthOAuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const refreshToken = searchParams.get('refresh_token')

  useEffect(() => {
    void (async () => {
      if (!refreshToken) return navigate('/login')

      const { success } = await api.post(
        '/auth/refresh-token',
        {},
        { headers: { Authorization: `Bearer ${refreshToken}` } }
      )

      if (!success) return navigate('/login')
      navigate('/')
    })()
  }, [refreshToken, navigate])

  return (
    <CardHeader>
      <CardTitle>Handling OAuth callback...</CardTitle>
    </CardHeader>
  )
}
