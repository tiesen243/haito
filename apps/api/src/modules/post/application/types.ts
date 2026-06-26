import * as z from 'zod'

export const post = z.object({
  id: z.cuid2(),
  title: z.string().min(4, 'Title must be at least 4 characters long'),
  content: z.string().min(10, 'Content must be at least 10 characters long'),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type Post = z.infer<typeof post>
