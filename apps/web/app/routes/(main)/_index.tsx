import type { AllNotesDto } from '@haito/api/dto/note'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@haito/ui/card'
import { Typography } from '@haito/ui/typography'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'

import { api } from '@/lib/api'

export default function IndexPage() {
  const { data } = useQuery({
    queryKey: ['notes'],
    queryFn: () =>
      api.get<AllNotesDto.Output>('/notes').then((res) => res.data),
  })

  return (
    <main className='container py-4'>
      <Typography variant='h1'>Shared Notes</Typography>

      <section className='mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {data?.notes.map((note) => (
          <Link to={`/${note.id}`} key={note.id}>
            <Card>
              <CardHeader>
                <CardTitle>{note.title || 'Untitled Note'}</CardTitle>
                <CardDescription>
                  Last Updated: {new Date(note.updatedAt).toDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className='truncate'>{note.content}</CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </main>
  )
}
