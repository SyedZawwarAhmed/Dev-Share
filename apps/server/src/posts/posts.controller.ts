import { Controller, Delete, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtOAuthGuard } from 'src/auth/jwt/jwt.oauth.guard';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) { }

  @Post()
  @UseGuards(JwtOAuthGuard)
  getPosts(@Req() req) {
    return this.postsService.getPosts(req.user.id);
  }

  @UseGuards(JwtOAuthGuard)
  @Post('add-post')
  addPost(@Req() req) {
    return this.postsService.addPost(req.user.id, req?.body);
  }

  @UseGuards(JwtOAuthGuard)
  @Get(':id')
  getPostById(@Req() req) {
    return this.postsService.getPostById(req.user.id, req?.params?.id);
  }

  @UseGuards(JwtOAuthGuard)
  @Put(':id')
  updatePost(@Req() req) {
    return this.postsService.updatePost(req.user.id, req?.params?.id, req?.body);
  }

  @UseGuards(JwtOAuthGuard)
  @Delete(':id')
  deletePost(@Req() req) {
    return this.postsService.deletePost(req.user.id, req?.params.id);
  }

  @UseGuards(JwtOAuthGuard)
  @Post('schedule-post/:id')
  schedulePost(@Req() req) {
    return this.postsService.schedulePost(req.user.id, req?.params.id, req?.body);
  }

  @UseGuards(JwtOAuthGuard)
  @Post('publish/:id')
  postNow(@Req() req) {
    return this.postsService.publishPostNow(req.user.id, req?.params.id);
  }
}
