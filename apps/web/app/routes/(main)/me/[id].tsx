import { NoteContent, NoteContentSkeleton } from '@/components/note-content'
import { useMeNote } from '@/routes/(main)/me/_lib/use-me-note'

import type { Route } from './+types/[id]'

export default function MeNoteDetailPage({ params }: Route.ComponentProps) {
  const { data, isLoading } = useMeNote(params.id ?? '')

  if (isLoading || !data) return <NoteContentSkeleton />
  return <NoteContent note={data} isOwner />
}
