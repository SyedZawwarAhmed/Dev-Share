import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(userId: string) {
    const [totalNotes, totalPosts, scheduledPosts] = await Promise.all([
      this.prisma.note.count({
        where: {
          userId,
          isDeleted: false,
        },
      }),
      this.prisma.post.count({
        where: {
          userId,
          isDeleted: false,
        },
      }),
      this.prisma.post.count({
        where: {
          userId,
          status: 'SCHEDULED',
          isDeleted: false,
        },
      }),
    ]);

    return {
      totalNotes,
      totalPosts,
      scheduledPosts,
    };
  }
}

