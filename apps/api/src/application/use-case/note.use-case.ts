import type {
  AllNotesDto,
  CreateNoteDto,
  OneNoteDto,
  UpdateNoteDto,
} from '@/application/dto/note.dto'
import type { IRepositoryBase } from '@/domain/abstracts/repository.base'

import { Auth } from '@/application/context'
import { Note } from '@/domain/entities/note.entity'
import { NoteRepository } from '@/domain/repositories/note.repository'
import { HttpError } from '@/shared/http-error'
import { createUseCase } from '@/shared/lib/utils'

// oxlint-disable-next-line typescript/no-extraneous-class
export class NoteUseCase {
  public static all = createUseCase<AllNotesDto.Input, AllNotesDto.Output>(
    (input) =>
      function* allUseCaseFunc() {
        const { page, limit, query, isPublic, userId, deleted } = input
        const offset = (page - 1) * limit

        const noteRepository = yield* NoteRepository

        const whereClause: IRepositoryBase.Criteria<Note> = {}
        if (query) whereClause.title = { $like: query }
        if (isPublic === true) whereClause.isPublic = true
        if (userId) whereClause.userId = userId
        whereClause.deletedAt = { $isNull: deleted === 'false' }

        const notes = yield* noteRepository.find(
          [whereClause],
          { updatedAt: 'desc' },
          { limit, offset }
        )

        const total = yield* noteRepository.count([whereClause])
        const totalPages = Math.ceil(total / limit)

        return {
          notes,
          meta: { page, pageSize: limit, total, totalPages },
        }
      }
  )

  public static me = createUseCase<
    Omit<AllNotesDto.Input, 'userId'>,
    AllNotesDto.Output
  >(
    (input) =>
      function* meUseCaseFunc() {
        const user = yield* Auth
        return yield* NoteUseCase.all({ ...input, userId: user.id })
      }
  )

  public static one = createUseCase<OneNoteDto.Input, OneNoteDto.Output>(
    (input) =>
      function* oneUseCaseFunc() {
        const noteRepository = yield* NoteRepository

        const [note] = yield* noteRepository.find([
          { id: input.id, isPublic: true, deletedAt: { $isNull: true } },
        ])
        if (!note) return yield* HttpError.notFound('Note not found')

        return note
      }
  )

  public static oneForMe = createUseCase<OneNoteDto.Input, OneNoteDto.Output>(
    (input) =>
      function* oneForMeUseCaseFunc() {
        const user = yield* Auth
        const noteRepository = yield* NoteRepository

        const [note] = yield* noteRepository.find([
          { id: input.id, userId: user.id },
        ])
        if (!note) return yield* HttpError.notFound('Note not found')

        return note
      }
  )

  public static create = createUseCase<
    CreateNoteDto.Input,
    CreateNoteDto.Output
  >(
    (input) =>
      function* createUseCaseFunc() {
        const user = yield* Auth
        const noteRepository = yield* NoteRepository

        const note = Note.make({
          title: input.title,
          content: input.content,
          userId: user.id,
        })
        yield* noteRepository.save(note)

        return note
      }
  )

  public static update = createUseCase<
    UpdateNoteDto.Input,
    UpdateNoteDto.Output
  >(
    (input) =>
      function* updateUseCaseFunc() {
        const { id, isDeleted, ...rest } = input

        const user = yield* Auth
        const noteRepository = yield* NoteRepository

        const [note] = yield* noteRepository.find([{ id, userId: user.id }])
        if (!note) return yield* HttpError.notFound('Note not found')

        if (isDeleted !== undefined) {
          if (note.deletedAt && isDeleted)
            return yield* HttpError.badRequest('Note already deleted')

          if (!note.deletedAt && isDeleted === false)
            return yield* HttpError.badRequest('Note is not deleted')
        }

        if (rest.isPublic !== undefined && isDeleted === true)
          return yield* HttpError.badRequest(
            'Cannot change visibility of a deleted note'
          )

        const updatedNote = note.clone({
          ...rest,
          deletedAt: isDeleted === true ? new Date() : null,
        })
        yield* noteRepository.save(updatedNote)

        return updatedNote
      }
  )
}
