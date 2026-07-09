import type { WhoAmIDto } from '@haito/api/dto/auth'

import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'

export const useAuth = () => {
  const { data, status } = useQuery({
    queryKey: ['auth', 'whoami'],
    queryFn: () =>
      api
        .get<WhoAmIDto.Output>('/auth/whoami')
        // oxlint-disable-next-line promise/prefer-await-to-then
        .then((res) => (res.success ? res.data : Promise.reject(res.message))),

    retry: 1,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return { user: data, status }
}
