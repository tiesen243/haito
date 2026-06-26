import * as z from 'zod'

import { post } from '@/modules/post/application/types'

export namespace GetOneDto {
  export const input = z.object({ id: z.cuid2() })
  export type Input = z.infer<typeof input>

  export const output = post
  export type Output = z.infer<typeof output>
}
