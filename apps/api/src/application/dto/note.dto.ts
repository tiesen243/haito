import * as z from 'zod'

import { baseSchema, PaginationSchema } from '@/application/types'
import { Note } from '@/domain/entities/note.entity'

export const noteSchema = baseSchema.extend({
  title: z.nullable(z.string()).optional(),
  content: z.string(),
  isPublic: z.boolean(),
  deletedAt: z.nullable(z.date()).default(null).optional(),
  userId: z.cuid2(),
  groupId: z.nullable(z.cuid2()).default(null).optional(),
})

export namespace AllNotesDto {
  export const input = PaginationSchema.input.extend({
    query: z.string().optional(),
    isPublic: noteSchema.shape.isPublic.optional(),
    userId: noteSchema.shape.userId.optional(),
    deleted: z.literal(['true', 'false']).optional(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    notes: z.array(noteSchema),
    meta: PaginationSchema.output,
  })
  export type Output = z.infer<typeof output>
}

export namespace OneNoteDto {
  export const input = noteSchema.pick({ id: true })
  export type Input = z.infer<typeof input>

  export const output = Note
  export type Output = z.infer<typeof output>
}

export namespace CreateNoteDto {
  export const input = noteSchema.pick({ title: true, content: true })
  export type Input = z.infer<typeof input>

  export const output = noteSchema
  export type Output = z.infer<typeof output>
}

export namespace UpdateNoteDto {
  export const input = CreateNoteDto.input
    .extend({
      ...noteSchema.pick({ id: true, isPublic: true }).shape,
      isDeleted: z.boolean(),
    })
    .partial()
  export type Input = z.infer<typeof input>

  export const output = noteSchema
  export type Output = z.infer<typeof output>
}
