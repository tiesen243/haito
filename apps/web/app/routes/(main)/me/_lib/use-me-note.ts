import type { OneNoteDto } from '@haito/api/dto/note'

import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'

export const useMeNote = (id: OneNoteDto.Input['id']) =>
  useQuery({
    queryKey: ['notes', 'me', id],
    queryFn: () =>
      // oxlint-disable-next-line promise/prefer-await-to-then
      api.get<OneNoteDto.Output>(`/notes/me/${id}`).then((res) => res.data),
  })
