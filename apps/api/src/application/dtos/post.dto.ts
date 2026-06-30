import * as z from 'zod'

export const postSchema = z.object({
  id: z.cuid2(),
  title: z.string().min(4).max(100),
  content: z.string().min(10).max(1000),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type PostSchema = z.infer<typeof postSchema>

export namespace GetPostsDto {
  export const input = z.void()
  export type Input = z.infer<typeof input>

  export const output = z.array(z.object(postSchema))
  export type Output = z.infer<typeof output>
}

export namespace CreatePostDto {
  export const input = z.object({
    title: z.string().min(4).max(100),
    content: z.string().min(10).max(1000),
  })
  export type Input = z.infer<typeof input>

  export const output = z.void()
  export type Output = z.infer<typeof output>
}
