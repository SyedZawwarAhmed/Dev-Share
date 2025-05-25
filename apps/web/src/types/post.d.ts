type Platform = "linkedin" | "x" | "bluesky";

type Post = {
  post_content: string;
  suggested_hashtags?: string[];
  platform: Platform;
};

type PostRecord = Record<Platform, Omit<Post, "platform">>;
