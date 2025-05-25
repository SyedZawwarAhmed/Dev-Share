import apiService from "@/lib/api";

function convertPostArrayToRecord(posts: Post[]): PostRecord {
  return posts.reduce((acc, post) => {
    const { platform, ...rest } = post;
    acc[platform] = rest;
    return acc;
  }, {} as PostRecord);
}

export const generatePostsService = async (body: {
  content: string;
  platforms: Platform[];
}) => {
  const data = await apiService.post<Post[]>("/gemini/get-content", body);

  return convertPostArrayToRecord(data.data);
};
