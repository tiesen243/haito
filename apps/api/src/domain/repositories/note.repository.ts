import * as Context from 'effect/Context'

import type { IRepositoryBase } from '@/domain/abstracts/repository.base'
import type { Note } from '@/domain/entities/note.entity'

// oxlint-disable-next-line typescript/no-empty-interface, typescript/no-empty-object-type
export interface INoteRepository extends IRepositoryBase<Note> {}

export class NoteRepository extends Context.Tag(
  'domain/repository/NoteRepository'
)<NoteRepository, INoteRepository>() {}
