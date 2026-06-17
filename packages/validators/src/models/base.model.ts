import * as z from 'zod'

export const BaseModel = z.object({
  id: z.cuid2(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
