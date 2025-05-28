import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async getPosts(userId: string) {
    return await this.prisma.post.findMany({
      where: {
        userId,
        isDeleted: false,
      },
    });
  }

  addPost(userId: string, post) {
    const newPost = this.prisma.post.create({
      data: post,
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
}
