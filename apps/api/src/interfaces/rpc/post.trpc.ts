import {
  CreatePostModel,
  ListPostsModel,
  OnePostModel,
} from '@haito/validators/models/post'

import type { PostUseCases } from '@/application/types/use-cases'

import { createTRPCRouter, publicProcedure } from '@/shared/trpc'

export const postTRPC = (useCases: PostUseCases) =>
  createTRPCRouter({
    list: publicProcedure
      .input(ListPostsModel.input)
      .output(ListPostsModel.output)
      .query(({ input }) => useCases.list.execute(input).then((r) => r.data)),

    one: publicProcedure
      .input(OnePostModel.input)
      .output(OnePostModel.output)
      .query(({ input }) => useCases.one.execute(input).then((r) => r.data)),

    create: publicProcedure
      .input(CreatePostModel.input)
      .output(CreatePostModel.output)
      .mutation(({ input }) =>
        useCases.create.execute(input).then((r) => r.data)
      ),

    update: publicProcedure
      .input(OnePostModel.input.extend(CreatePostModel.input.shape))
      .output(CreatePostModel.output)
      .mutation(({ input }) =>
        useCases.update.execute(input).then((r) => r.data)
      ),
  })
