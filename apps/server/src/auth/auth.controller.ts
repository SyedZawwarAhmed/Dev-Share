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
import { LinkedinOAuthGuard } from './linkedin/linkedin.oauth.guard';

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
    try {
      const { token, user } = await this.authService.googleLogin(req.user);

      // Redirect to the frontend dashboard
      const redirectUrl = new URL('/callback', process.env.FRONTEND_URL);

      // Optionally add user info as query parameters
      redirectUrl.searchParams.append('id', encodeURIComponent(user?.id));
      redirectUrl.searchParams.append(
        'firstName',
        encodeURIComponent(user?.firstName),
      );
      redirectUrl.searchParams.append(
        'lastName',
        encodeURIComponent(user?.lastName),
      );
      redirectUrl.searchParams.append('email', encodeURIComponent(user?.email));
      redirectUrl.searchParams.append('token', encodeURIComponent(token));
      redirectUrl.searchParams.append(
        'image',
        encodeURIComponent(user?.profileImage),
      );

      // Redirect to the frontend
      res.redirect(redirectUrl.toString());
    } catch (error) {
      // Handle any errors during the OAuth callback
      console.error('Google OAuth callback error:', error);

      // Redirect to login page with error
      res.redirect(
        `${process.env.FRONTEND_URL}/login?error=Authentication failed`,
      );
    }
  }

  @Get('linkedin')
  @UseGuards(LinkedinOAuthGuard)
  async linkedinAuth() {
    // This will redirect to LinkedIn
  }

  @Get('linkedin/callback')
  @UseGuards(LinkedinOAuthGuard)
  async linkedinAuthCallback(@Req() req, @Res() res: Response) {
    try {
      const { token, user } = await this.authService.linkedinLogin(req.user);

      const redirectUrl = new URL('/callback', process.env.FRONTEND_URL);
      redirectUrl.searchParams.append('id', encodeURIComponent(user?.id));
      redirectUrl.searchParams.append(
        'firstName',
        encodeURIComponent(user?.firstName),
      );
      redirectUrl.searchParams.append(
        'lastName',
        encodeURIComponent(user?.lastName),
      );
      redirectUrl.searchParams.append('email', encodeURIComponent(user?.email));
      redirectUrl.searchParams.append('token', encodeURIComponent(token));
      redirectUrl.searchParams.append(
        'image',
        encodeURIComponent(user?.profileImage),
      );

      res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('LinkedIn OAuth callback error:', error);
      res.redirect(
        `${process.env.FRONTEND_URL}/login?error=Authentication failed`,
      );
    }
  }

  @UseGuards(JwtOAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
