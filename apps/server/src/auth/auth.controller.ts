import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LocalOAuthGuard } from './local/local.oauth.guard';
import { GoogleOAuthGuard } from './google/google.ouath.guard';
import { JwtOAuthGuard } from './jwt/jwt.oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body()
    signupData: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    },
  ) {
    return this.authService.signup(
      signupData.email,
      signupData.password,
      signupData.firstName,
      signupData.lastName,
    );
  }

  @UseGuards(LocalOAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(LocalOAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    return req.logout();
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    // This will redirect to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const { access_token, user } = await this.authService.googleLogin(req.user);

    // You might want to redirect to your frontend with the token
    // res.redirect(
    //   `${process.env.FRONTEND_URL}/auth/callback?token=${access_token}`,
    // );
  }

  @UseGuards(JwtOAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
