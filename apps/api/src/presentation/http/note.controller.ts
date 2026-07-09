import { Elysia } from 'elysia'

import {
  AllNotesDto,
  CreateNoteDto,
  OneNoteDto,
  UpdateNoteDto,
} from '@/application/dto/note.dto'
import { NoteUseCase } from '@/application/use-case/note.use-case'
import { authMiddleware } from '@/presentation/middleware/auth.middleware'

export const noteController = new Elysia({
  name: 'presentation/http/note.controller',
  prefix: '/api/notes',
  tags: ['notes'],
})

  .get('/', ({ query }) => NoteUseCase.all({ ...query, isPublic: true }), {
    query: AllNotesDto.input.omit({
      isPublic: true,
      userId: true,
      deleted: true,
    }),
  })

  .get('/:id', ({ params }) => NoteUseCase.one(params), {
    params: OneNoteDto.input,
  })

  .use(authMiddleware)

  .get('/me', ({ query }) => NoteUseCase.me(query), {
    query: AllNotesDto.input.omit({ userId: true }),
  })

  .post('/create', ({ body }) => NoteUseCase.create(body), {
    body: CreateNoteDto.input,
  })

  .patch(
    '/update/:id',
    ({ params, body }) => NoteUseCase.update({ ...params, ...body }),
    {
      params: OneNoteDto.input,
      body: UpdateNoteDto.input.omit({ id: true, isDeleted: true }),
    }
  )

  .patch('/restore/:id', ({ params: { id } }) =>
    NoteUseCase.update({ id, isDeleted: false })
  )

  .delete(
    '/delete/:id',
    ({ params: { id } }) => NoteUseCase.update({ id, isDeleted: true }),
    { params: OneNoteDto.input }
  )
