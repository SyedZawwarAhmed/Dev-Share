import { Controller, Post, Body } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private geminiService: GeminiService) {}

  @Post('get-content')
  // @UseGuards(JwtOAuthGuard)
  async getContent(@Body() req) {
    return await Promise.all(
      req.platforms.map((platform) =>
        this.geminiService.generateSocialContent(req.content, platform),
      ),
    );
  }
}
