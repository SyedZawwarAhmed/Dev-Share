import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocialMediaService } from './social-media.service';
import { PostsSchedulerService } from './posts-scheduler.service';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private socialMediaService: SocialMediaService,
    private postsSchedulerService: PostsSchedulerService,
  ) {}

  private mapPlatform(frontendPlatform: string): string {
    const platformMap = {
      'X': 'TWITTER',
      'LINKEDIN': 'LINKEDIN',
      'BLUESKY': 'BLUESKY'
    };
    return platformMap[frontendPlatform.toUpperCase()] || frontendPlatform.toUpperCase();
  }

  async getPosts(
    userId: string,
    filters?: {
      status?: string;
      search?: string;
      platform?: string;
      noteId?: string;
      orderBy?: 'asc' | 'desc';
      page?: number;
      limit?: number;
    },
  ) {
    const whereClause: any = {
      userId,
      isDeleted: false,
    };

    if (filters?.status) {
      // Map frontend status values to PostStatus enum
      const statusMap = {
        scheduled: 'SCHEDULED',
        draft: 'DRAFT',
        published: 'PUBLISHED',
      };
      whereClause.status =
        statusMap[filters.status.toLowerCase()] || filters.status.toUpperCase();
    }

    if (filters?.platform) {
      // Map frontend platform values to backend enum
      const platformMap = {
        linkedin: 'LINKEDIN',
        twitter: 'TWITTER',
        bluesky: 'BLUESKY',
      };
      whereClause.platform =
        platformMap[filters.platform.toLowerCase()] || filters.platform.toUpperCase();
    }

    if (filters?.noteId) {
      whereClause.noteId = filters.noteId;
    }

    if (filters?.search) {
      whereClause.OR = [
        {
          content: {
            contains: filters.search,
          },
        },
        {
          note: {
            title: {
              contains: filters.search,
            },
          },
        },
        {
          note: {
            content: {
              contains: filters.search,
            },
          },
        },
      ];
    }

    if (filters?.page && filters?.limit) {
      whereClause.skip = (filters.page - 1) * filters.limit;
      whereClause.limit = filters.limit;
    }

    return await this.prisma.post.findMany({
      where: whereClause,
      include: {
        note: true,
      },
      orderBy: {
        updatedAt: filters?.orderBy || 'desc',
      },
    });
  }

  addPost(userId: string, post) {
    const newPost = this.prisma.post.create({
      data: { ...post, platform: this.mapPlatform(post.platform), userId },
    });
    return newPost;
  }

  getPostById(userId: string, postId: string) {
    return this.prisma.post.findFirst({
      where: {
        id: postId,
        userId,
        isDeleted: false,
      },
      include: {
        note: true,
      },
    });
  }

  updatePost(userId: string, postId: string, post) {
    return this.prisma.post.update({
      where: {
        id: postId,
        userId,
      },
      data: post,
    });
  }

  deletePost(userId: string, postId: string) {
    return this.prisma.post.update({
      where: {
        id: postId,
        userId,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  async schedulePost(
    userId: string,
    postId: string,
    schedule: { scheduledFor: string },
  ) {
    // Ensure the scheduled time is converted to UTC
    const scheduledFor = new Date(schedule.scheduledFor);
    
    // Convert to UTC explicitly to avoid timezone issues
    const scheduledForUTC = new Date(scheduledFor.toISOString());
    const nowUTC = new Date();

    if (scheduledForUTC < nowUTC) {
      throw new BadRequestException('Scheduled time must be in the future');
    }

    // Use the scheduler service to properly schedule the post with UTC time
    await this.postsSchedulerService.schedulePost(userId, postId, scheduledForUTC);

    return this.prisma.post.findFirst({
      where: {
        id: postId,
        userId,
      },
    });
  }

  async publishPostNow(userId: string, postId: string) {
    const post = await this.prisma.post.findFirst({
      where: {
        id: postId,
        userId,
        isDeleted: false,
      },
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    try {
      const result = await this.socialMediaService.publishPost(postId);

      return {
        post,
        result,
      };
    } catch (error) {
      // Re-throw the specific error from social media service as BadRequest
      throw new BadRequestException(error.message);
    }
  }

  async markAsPublished(userId: string, postId: string) {
    const post = await this.prisma.post.findFirst({
      where: {
        id: postId,
        userId,
        isDeleted: false,
      },
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    return await this.prisma.post.update({
      where: {
        id: postId,
        userId,
      },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
      include: {
        note: true,
      },
    });
  }
}
