import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "../../db";

export const sessionsRouter = createTRPCRouter({
  createSession: publicProcedure.mutation(async () => {
    const session = await prisma.session.create({});
    return session;
  }),
});
