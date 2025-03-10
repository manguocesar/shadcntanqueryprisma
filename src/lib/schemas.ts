import { z } from "zod";

export const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  field: z.string(),
  published: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  authorId: z.number().nullable(),
  authorEmail: z.string().nullable(),
  author: z
    .object({
      name: z.string().nullable(),
    })
    .optional(),
});

export const CreatePostInputSchema = z.object({
  title: z.string(),
  body: z.string(),
  authorEmail: z.string().email().optional(),
  authorName: z.string().optional(),
  field: z.string().optional(), //
});

export type Post = z.infer<typeof PostSchema>;
export type CreatePostInput = z.infer<typeof CreatePostInputSchema>;
