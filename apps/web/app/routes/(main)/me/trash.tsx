import type { AllNotesDto } from '@haito/api/dto/note'

import { Button } from '@haito/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@haito/ui/card'
import { ArchiveRestoreIcon } from '@haito/ui/icons'
import { toast } from '@haito/ui/toast'
import { Typography } from '@haito/ui/typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'

export default function MeIndexPage() {
  const { data } = useQuery({
    queryKey: ['me', 'notes', 'trash'],
    queryFn: () =>
      api
        .get<AllNotesDto.Output>('/notes/me?deleted=true')
        .then((res) => res.data),
  })

  return (
    <main className='container py-4'>
      <Typography variant='h1'>Your Trash</Typography>

      <section className='mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {data?.notes.map((note) => (
          <NoteCard note={note} key={note.id} />
        ))}
      </section>
    </main>
  )
}

const NoteCard: React.FC<{ note: AllNotesDto.Output['notes'][number] }> = ({
  note,
}) => {
  const queryClient = useQueryClient()
  const restoreNote = useMutation({
    mutationFn: () =>
      api
        .patch(`/notes/restore/${note.id}`)
        .then((res) => (res.success ? res.data : Promise.reject(res.message))),
    onSuccess: () => {
      toast.add({ type: 'success', description: 'Note restored successfully' })
      queryClient.invalidateQueries({ queryKey: ['me', 'notes'] })
      queryClient.invalidateQueries({ queryKey: ['me', 'notes', 'trash'] })
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className='line-clamp-1'>{note.content}</CardTitle>
        <CardDescription>
          Deleted At:{' '}
          {note.deletedAt ? new Date(note.deletedAt).toDateString() : 'Unknown'}
        </CardDescription>

        <CardAction>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => restoreNote.mutate()}
            disabled={restoreNote.isPending}
          >
            <ArchiveRestoreIcon />
            <span className='sr-only'>Restore Note</span>
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  )
}
