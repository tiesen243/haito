import type { InvalidateQueryFilters } from '@tanstack/react-query'

import {
  defaultShouldDehydrateQuery,
  MutationCache,
  QueryClient,
} from '@tanstack/react-query'

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 10, // 10 minutes
      },
      mutations: {
        gcTime: 1000 * 60 * 5, // 5 minutes
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) &&
          query.state.status === 'pending',
      },
    },

    mutationCache: new MutationCache({
      onSettled(
        _data,
        _error,
        _variables,
        _onMutateResult,
        _mutation,
        context
      ) {
        const filter = context.meta?.filter
        if (!filter) return

        void (Array.isArray(filter)
          ? Promise.all(filter.map((f) => context.client.invalidateQueries(f)))
          : context.client.invalidateQueries(filter))
      },
    }),
  })

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      filter: InvalidateQueryFilters | InvalidateQueryFilters[]
    }
  }
}
