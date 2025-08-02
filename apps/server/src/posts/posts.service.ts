import { BadRequestException, Injectable } from '@nestjs/common';
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
    const scheduledFor = new Date(schedule.scheduledFor);
    const now = new Date();

    if (scheduledFor < now) {
      throw new BadRequestException('Scheduled time must be in the future');
    }

    // Use the scheduler service to properly schedule the post
    await this.postsSchedulerService.schedulePost(userId, postId, scheduledFor);

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

    const result = await this.socialMediaService.publishPost(postId);

    return {
      post,
      result,
    };
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
