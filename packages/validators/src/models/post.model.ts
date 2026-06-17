import * as z from 'zod'

import { BaseModel } from '@/models/base.model'

export const postModel = BaseModel.extend({ title: z.string().min(4) })
export type PostModel = z.infer<typeof postModel>

export namespace ListPostsModel {
  export const input = z.void()
  export type Input = z.infer<typeof input>

  export const output = postModel.array()
  export type Output = z.infer<typeof output>
}

export namespace OnePostModel {
  export const input = postModel.pick({ id: true })
  export type Input = z.infer<typeof input>

  export const output = postModel
  export type Output = z.infer<typeof output>
}

export namespace CreatePostModel {
  export const input = postModel.pick({ title: true })
  export type Input = z.infer<typeof input>

  export const output = postModel.pick({ id: true })
  export type Output = z.infer<typeof output>
}
