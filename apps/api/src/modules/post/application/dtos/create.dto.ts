import type * as z from 'zod'

import { post } from '@/modules/post/application/types'

export namespace CreateDto {
  export const input = post.pick({ title: true, content: true })
  export type Input = z.infer<typeof input>

  export const output = post
  export type Output = z.infer<typeof output>
}
