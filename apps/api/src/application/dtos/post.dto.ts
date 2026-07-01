import * as z from 'zod'

import { PaginationSchema } from '@/shared/schema'

export const postSchema = z.object({
  id: z.cuid2(),
  title: z.string().min(4).max(100),
  content: z.string().min(10).max(1000),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type PostSchema = z.infer<typeof postSchema>

export namespace GetPostsDto {
  export const input = PaginationSchema.input.extend({
    query: z.string().optional(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    posts: z.array(postSchema),
    meta: PaginationSchema.output,
  })
  export type Output = z.infer<typeof output>
}

export namespace GetPostDto {
  export const input = postSchema.pick({ id: true })
  export type Input = z.infer<typeof input>

  export const output = postSchema
  export type Output = z.infer<typeof output>
}

export namespace CreatePostDto {
  export const input = z.object({
    title: z.string().min(4).max(100),
    content: z.string().min(10).max(1000),
  })
  export type Input = z.infer<typeof input>

  export const output = postSchema
  export type Output = z.infer<typeof output>
}
