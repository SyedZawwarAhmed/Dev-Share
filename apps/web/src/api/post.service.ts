import apiService from "@/lib/api";
import {
  createPostSchema,
  schedulePostSchema,
  updatePostSchema,
  getPostsFiltersSchema,
} from "@/schemas/post.schema";
import { z } from "zod";

export const getPostsService = async (
  filters?: z.infer<typeof getPostsFiltersSchema>
) => {
  const validatedFilters = filters ? getPostsFiltersSchema.parse(filters) : {};
  const data = await apiService.post<Post[]>("/posts", validatedFilters);
  return data.data;
};

export const addPostService = async (
  post: z.infer<typeof createPostSchema>
) => {
  const validatedPost = createPostSchema.parse(post);
  const data = await apiService.post<Post>("/posts/add-post", validatedPost);
  return data.data;
};

export const getPostService = async (id: string) => {
  const data = await apiService.get<Post>(`/posts/${id}`);
  return data.data;
};

export const updatePostService = async (
  id: string,
  post: z.infer<typeof updatePostSchema>
) => {
  const validatedPost = updatePostSchema.parse(post);
  const data = await apiService.put<Post>(`/posts/${id}`, validatedPost);
  return data.data;
};

export const deletePostService = async (id: string) => {
  const data = await apiService.delete<Post>(`/posts/${id}`);
  return data.data;
};

export const publishPostService = async (id: string) => {
  const data = await apiService.post<Post>(`/posts/publish/${id}`);
  return data.data;
};

export const schedulePostService = async (
  id: string,
  schedule: z.infer<typeof schedulePostSchema>
) => {
  const validatedSchedule = schedulePostSchema.parse(schedule);
  const data = await apiService.post<Post>(
    `/posts/schedule-post/${id}`,
    validatedSchedule
  );
  return data.data;
};

export const markAsPublishedService = async (id: string) => {
  const data = await apiService.post<Post>(`/posts/mark-published/${id}`);
  return data.data;
};
