import { initTRPC } from '@trpc/server'

const t = initTRPC.create()

const createTRPCRouter = t.router

const publicProcedure = t.procedure

export { createTRPCRouter, publicProcedure }
