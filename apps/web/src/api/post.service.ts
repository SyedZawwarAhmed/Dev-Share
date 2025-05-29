import apiService from "@/lib/api";

export const getPostsService = async () => {
  const data = await apiService.post<Post[]>("/posts");
  return data.data;
};

export const addPostService = async (post: CreatePostPayload) => {
  const data = await apiService.post<Post>("/posts/add-post", post);
  return data.data;
};

export const getPostService = async (id: string) => {
  const data = await apiService.get<Post>(`/posts/${id}`);
  return data.data;
};

export const updatePostService = async (id: string, post: Post) => {
  const data = await apiService.put<Post>(`/posts/${id}`, post);
  return data.data;
};

export const deletePostService = async (id: string) => {
  const data = await apiService.delete<Post>(`/posts/${id}`);
  return data.data;
};
