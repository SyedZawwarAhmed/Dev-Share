import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PostsService, PrismaService],
  controllers: [PostsController],
})
export class PostsModule {}
