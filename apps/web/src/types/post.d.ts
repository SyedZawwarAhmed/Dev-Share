type Platform = "LINKEDIN" | "TWITTER" | "BLUESKY";

type GeneratedPost = {
  post_content: string;
  suggested_hashtags?: string[];
  platform: Platform;
};

type PostRecord = Record<Platform, Omit<GeneratedPost, "platform">>;

type CreatePostPayload = {
  content: string;
  platform: Platform;
  published: boolean;
  scheduledFor?: Date;
  publishedAt?: Date;
  noteId: string;
  title?: string;
  tags?: string[];
  imageUrl?: string;
};

type Post = {
  id: string;
  content: string;
  platform: Platform;
  published: boolean;
  scheduledFor?: Date;
  publishedAt?: Date;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  title?: string;
  tags?: string[];
  imageUrl?: string;
  views?: number;
  likes?: number;
  shares?: number;
  userId: string;
  noteId: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED";
  note: Note;
};
