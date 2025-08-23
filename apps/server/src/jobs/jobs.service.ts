import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(private readonly configService: ConfigService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async checkScheduledPosts() {
    try {
      this.logger.log('Hitting the server to keep the instance running...');

      const BACKEND_URL = this.configService.get<string>('BACKEND_URL');
      fetch(`${BACKEND_URL}/api`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
