// hooks/use-posts.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";
import { Post, CreatePostInput } from "@/lib/schemas";

// Hooks
export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => trpc.getPosts.query(),
  });
}

export function usePost(id: number) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => trpc.getPost.query({ id }),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPost: CreatePostInput) => trpc.createPost.mutate(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Post> }) =>
      trpc.updatePost.mutate({ id, data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", data.id] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => trpc.deletePost.mutate({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
