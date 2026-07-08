import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { NoteRepository } from '@/domain/repositories/note.repository'
import { InMemoryClient } from '@/infrastructure/persistence/in-memory/in-memory.client'
import { InMemoryBaseRepository } from '@/infrastructure/persistence/in-memory/repositories/base.repository'

export const InMemoryNoteRepository = Layer.effect(
  NoteRepository,
  Effect.gen(function* InMemoryUserRepositoryImpl() {
    const { notes } = yield* InMemoryClient

    return {
      ...InMemoryBaseRepository(notes),
    }
  })
)
