import apiService from "@/lib/api";

type Post = {
  post_content: string;
  suggested_hashtags?: string[];
  platform: string;
};

type PostRecord = Record<string, Omit<Post, "platform">>;

function convertPostArrayToRecord(posts: Post[]): PostRecord {
  return posts.reduce((acc, post) => {
    const { platform, ...rest } = post;
    acc[platform] = rest;
    return acc;
  }, {} as PostRecord);
}

export const generatePostsService = async (body: {
  content: string;
  platforms: ("Linkedin" | "X" | "Bluesky")[];
}) => {
  const data = await apiService.post<Post[]>("/gemini/get-content", body);

  return convertPostArrayToRecord(data.data);
};
