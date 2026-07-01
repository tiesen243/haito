import * as z from 'zod'

export namespace PaginationSchema {
  export const input = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    page: z.int().positive(),
    pageSize: z.int().nonnegative(),
    total: z.int().nonnegative(),
    totalPages: z.int().positive(),
  })
  export type Output = z.infer<typeof output>
}
