import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { Note } from '@/domain/entities/note.entity'
import { NoteRepository } from '@/domain/repositories/note.repository'
import { DrizzleClient } from '@/infrastructure/persistence/drizzle/drizzle.client'
import { DrizzleBaseRepository } from '@/infrastructure/persistence/drizzle/repositories/base.repository'

export const DrizzleNoteRepository = Layer.effect(
  NoteRepository,
  Effect.gen(function* DrizzleUserRepositoryImpl() {
    const { db, $ } = yield* DrizzleClient
    const { notes } = DrizzleClient.schema

    return {
      ...DrizzleBaseRepository(db, $, Note, notes),
    }
  })
)
