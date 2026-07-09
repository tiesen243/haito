import type { OneNoteDto } from '@haito/api/dto/note'

import { useQuery } from '@tanstack/react-query'

import { NoteContent, NoteContentSkeleton } from '@/components/note-content'
import { api } from '@/lib/api'

import type { Route } from './+types/[id]'

export default function NoteDetailPage({ params }: Route.ComponentProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['notes', params.id],
    queryFn: () =>
      api.get<OneNoteDto.Output>(`/notes/${params.id}`).then((res) => res.data),
  })

  if (isLoading || !data) return <NoteContentSkeleton />
  return <NoteContent note={data} />
}
