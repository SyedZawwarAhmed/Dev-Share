import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostStatus } from 'generated/prisma';
import { SocialMediaService } from './social-media.service';

@Injectable()
export class PostsSchedulerService {
  private readonly logger = new Logger(PostsSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly socialMediaService: SocialMediaService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkScheduledPosts() {
    this.logger.log('Checking for scheduled posts...');
    
    try {
      const now = new Date();
      const scheduledPosts = await this.prisma.post.findMany({
        where: {
          status: PostStatus.SCHEDULED,
          scheduledFor: {
            lte: now, // Less than or equal to current time
          },
          isDeleted: false,
        },
        select: {
          id: true,
          content: true,
          platform: true,
          scheduledFor: true,
        },
      });

      this.logger.log(`Found ${scheduledPosts.length} posts to publish`);

      for (const post of scheduledPosts) {
        await this.publishScheduledPost(post.id);
      }
    } catch (error) {
      this.logger.error('Error checking scheduled posts:', error.message);
    }
  }

  private async publishScheduledPost(postId: string) {
    try {
      this.logger.log(`Publishing scheduled post: ${postId}`);
      
      const result = await this.socialMediaService.publishPost(postId);
      this.logger.log(`Successfully published post ${postId}:`, result);
      
      return result;
    } catch (error) {
      this.logger.error(`Failed to publish post ${postId}:`, error.message);
      
      // Update post status to DRAFT on failure so it can be retried manually
      await this.prisma.post.update({
        where: { id: postId },
        data: { status: PostStatus.DRAFT },
      });
      
      throw error;
    }
  }

  async schedulePost(userId: string, postId: string, scheduledAt: Date) {
    // Update the post status to SCHEDULED
    await this.prisma.post.update({
      where: {
        id: postId,
        userId,
      },
      data: {
        status: PostStatus.SCHEDULED,
        scheduledFor: scheduledAt,
      },
    });

    this.logger.log(`Post ${postId} scheduled for ${scheduledAt}`);
  }
} 