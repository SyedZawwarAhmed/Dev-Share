import { Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtOAuthGuard } from 'src/auth/jwt/jwt.oauth.guard';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

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
  @Post('update-post/:id')
  updatePost(@Req() req) {
    return this.postsService.updatePost(req.user.id, req?.body.id, req?.body);
  }

  @UseGuards(JwtOAuthGuard)
  @Delete(':id')
  deletePost(@Req() req) {
    return this.postsService.deletePost(req.user.id, req?.params.id);
  }
}
