import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "../../db";

export const usersRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.create({
        data: {
          name: input.name,
        },
      });
      return user;
    }),
  findUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });
      return user;
    }),
});
