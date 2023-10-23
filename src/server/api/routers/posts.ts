import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({ content: z.string().min(1), authorId: z.string().min(1) }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          authorId: input.authorId,
          content: input.content,
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({ orderBy: { createdAt: "desc" } });
  }),
});
