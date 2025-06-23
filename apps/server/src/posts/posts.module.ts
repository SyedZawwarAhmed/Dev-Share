import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocialMediaService } from './social-media.service';
import { PostsSchedulerService } from './posts-scheduler.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
  ],
  providers: [
    PostsService, 
    PrismaService, 
    SocialMediaService, 
    PostsSchedulerService,
  ],
  controllers: [PostsController],
})
export class PostsModule {}
