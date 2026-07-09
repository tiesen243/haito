import * as z from 'zod'

export const userSchema = z.object({
  id: z.cuid2(),
  username: z.string().min(4).max(24),
  email: z.email(),
  image: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable().optional(),
})
