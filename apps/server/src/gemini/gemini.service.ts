import { Injectable } from '@nestjs/common';

// @Injectable()
// export class GeminiService {
//   async getContent(
//     prompt: string,
//     platforms: ('Linkedin' | 'X' | 'Bluesky')[],
//   ) {
//     return await Promise.all(
//       platforms.map((platform) => getGeminiContent(prompt, platform)),
//     );
//   }
// }

import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService {
  private readonly ai: GoogleGenAI;
  private readonly promptTemplate: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    const promptTemplate = this.configService.get<string>('SYSTEM_PROMPT');

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }

    if (!promptTemplate) {
      throw new Error('SYSTEM_PROMPT is not defined in environment variables');
    }

    this.ai = new GoogleGenAI({ apiKey });
    this.promptTemplate = promptTemplate;
  }

  async generateSocialContent(
    content: string,
    platform: SocialPlatform,
  ): Promise<GeminiResponse> {
    const prompt = this.buildPrompt(content, platform);
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash',
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              post_content: {
                type: 'string',
                description: 'The formatted post content'
              },
              suggested_hashtags: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: 'Array of suggested hashtags if applicable'
              },
              platform: {
                type: 'string',
                description: 'The platform identifier'
              }
            },
            required: ['post_content', 'platform']
          }
        },
        contents: prompt,
      });
      const result = response.candidates?.[0].content?.parts?.[0]?.text;

      if (!result) {
        throw new Error('No response received from Gemini AI');
      }

      return JSON.parse(result) as GeminiResponse;
    } catch (error) {
      throw new Error(`Failed to generate content: ${error?.message}`);
    }
  }

  private buildPrompt(content: string, platform: SocialPlatform): string {
    return this.promptTemplate
      .replace('%%platform%%', platform)
      .replace('%%content%%', content);
  }
}
