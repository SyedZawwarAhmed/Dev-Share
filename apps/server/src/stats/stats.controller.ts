import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtOAuthGuard } from 'src/auth/jwt/jwt.oauth.guard';

@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get('dashboard')
  @UseGuards(JwtOAuthGuard)
  getDashboardStats(@Req() req) {
    return this.statsService.getDashboardStats(req.user.id);
  }
}