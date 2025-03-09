import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { PostSchema, CreatePostInputSchema } from "./schemas";

const prisma = new PrismaClient();

const t = initTRPC.create();

export const appRouter = t.router({
  getPosts: t.procedure.query(async () => {
    console.log("posts");
    const posts = await prisma.post.findMany({
      include: { author: { select: { name: true } } },
    });

    return posts;
  }),

  getPost: t.procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const post = await prisma.post.findUnique({
        where: { id: input.id },
        include: { author: { select: { name: true } } },
      });
      if (!post) throw new Error("Post not found");
      return post;
    }),

  createPost: t.procedure
    .input(CreatePostInputSchema)
    .mutation(async ({ input }) => {
      const post = await prisma.post.create({
        data: {
          title: input.title,
          body: input.body,
          author: input.authorEmail
            ? { connect: { email: input.authorEmail } }
            : input.authorName
            ? { create: { name: input.authorName } }
            : undefined,
        },
      });
      return post;
    }),

  updatePost: t.procedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          title: z.string().optional(),
          body: z.string().optional(),
          published: z.boolean().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const post = await prisma.post.update({
        where: { id: input.id },
        data: input.data,
      });
      return post;
    }),

  deletePost: t.procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await prisma.post.delete({ where: { id: input.id } });
      return { success: true };
    }),
});

export type AppRouter = typeof appRouter;
