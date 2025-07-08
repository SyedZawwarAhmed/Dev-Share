import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocialMediaService } from './social-media.service';
import { PostsSchedulerService } from './posts-scheduler.service';
import { PostStatus } from 'generated/prisma';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private socialMediaService: SocialMediaService,
    private postsSchedulerService: PostsSchedulerService,
  ) {}

  async getPosts(userId: string) {
    return await this.prisma.post.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      include: {
        note: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  addPost(userId: string, post) {
    const newPost = this.prisma.post.create({
      data: { ...post, platform: post.platform.toUpperCase(), userId },
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

  async schedulePost(userId: string, postId: string, post) {
    const scheduledAt = new Date(post.scheduledAt);
    const now = new Date();

    if (scheduledAt < now) {
      throw new BadRequestException('Scheduled time must be in the future');
    }

    // Use the scheduler service to properly schedule the post
    await this.postsSchedulerService.schedulePost(userId, postId, scheduledAt);

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
}
