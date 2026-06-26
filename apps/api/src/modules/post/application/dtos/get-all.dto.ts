import * as z from 'zod'

import { post } from '@/modules/post/application/types'

export namespace GetAllDto {
  export const input = z.void()
  export type Input = z.infer<typeof input>

  export const output = z.array(post)
  export type Output = z.infer<typeof output>
}
