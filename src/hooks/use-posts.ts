// hooks/use-posts.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
export interface Post {
  id: number;
  title: string;
  body: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: number | null;
  author?: {
    name: string | null;
  };
}

export interface CreatePostInput {
  title: string;
  body: string;
  authorEmail?: string;
  authorName?: string;
}

// Fetch functions
const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch("/api/posts");
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json();
};

const fetchPost = async (id: number): Promise<Post> => {
  const response = await fetch(`/api/posts/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }
  return response.json();
};

const createPost = async (newPost: CreatePostInput): Promise<Post> => {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create post");
  }

  return response.json();
};

const updatePost = async ({
  id,
  ...data
}: Partial<Post> & { id: number }): Promise<Post> => {
  const response = await fetch(`/api/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update post");
  }

  return response.json();
};

const deletePost = async (id: number): Promise<void> => {
  const response = await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete post");
  }
};

// Hooks
export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });
}

export function usePost(id: number) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", data.id] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
