type SocialPlatform = 'linkedin' | 'x' | 'bluesky';

type GeminiResponse = {
  post_content: string;
  suggested_hashtags: string[];
  platform: SocialPlatform;
};

type GeminiConfig = {
  responseMimeType: string;
};

type GeminiPromptConfig = {
  model: string;
  config: GeminiConfig;
  contents: string;
};
