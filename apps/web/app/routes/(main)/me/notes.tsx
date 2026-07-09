import type { AllNotesDto } from '@haito/api/dto/note'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@haito/ui/card'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'

import { api } from '@/lib/api'

export default function MeNotesPage() {
  const { data } = useQuery({
    queryKey: ['me', 'notes'],
    queryFn: () =>
      api.get<AllNotesDto.Output>('/notes/me').then((res) => res.data),
  })

  return (
    <main className='container'>
      <section className='grid gap-4 py-8 md:grid-cols-2 lg:grid-cols-3'>
        {data?.notes.map((note) => (
          <Link to={`/me/${note.id}`} key={note.id}>
            <Card>
              <CardHeader>
                <CardTitle>{note.title || 'Untitled Note'}</CardTitle>
                <CardDescription>
                  {new Date(note.updatedAt).toDateString()}
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
