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
import { TwitterStrategy } from './twitter/twitter.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private twitterStrategy: TwitterStrategy,
  ) {}

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

  @UseGuards(JwtOAuthGuard)
  @Get('me')
  async me(@Req() req) {
    return this.authService.me(req.user);
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
      const { token } = await this.authService.googleLogin(req.user);
      const redirectUrl = new URL('/callback', process.env.FRONTEND_URL);
      redirectUrl.searchParams.append('token', encodeURIComponent(token));
      res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('Google OAuth callback error:', error);
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
      const { token } = await this.authService.linkedinLogin(req.user);
      const redirectUrl = new URL('/callback', process.env.FRONTEND_URL);
      redirectUrl.searchParams.append('token', encodeURIComponent(token));
      res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('LinkedIn OAuth callback error:', error);
      res.redirect(
        `${process.env.FRONTEND_URL}/login?error=Authentication failed`,
      );
    }
  }

  @Get('twitter')
  async twitterAuth(@Req() req, @Res() res: Response) {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const state = Math.random().toString(36).substring(7);
    // Store user ID in state for callback
    const stateWithUser = `${state}_${userId}`;
    const authUrl = this.twitterStrategy.getAuthUrl(stateWithUser);
    res.redirect(authUrl);
  }

  @Get('twitter/callback')
  async twitterAuthCallback(@Req() req, @Res() res: Response) {
    try {
      const { code, state, error } = req.query;

      if (error) {
        throw new Error(`Twitter OAuth error: ${error}`);
      }

      if (!code || !state) {
        throw new Error('No authorization code or state received');
      }

      // Extract user ID from state
      const [, userId] = (state as string).split('_');
      if (!userId) {
        throw new Error('Invalid state parameter');
      }

      const twitterProfile = await this.twitterStrategy.exchangeCodeForToken(
        code as string,
      );
      const { token } = await this.authService.linkTwitterAccount(userId, twitterProfile);

      const redirectUrl = new URL('/callback', process.env.FRONTEND_URL);
      redirectUrl.searchParams.append('token', encodeURIComponent(token));
      res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('Twitter OAuth callback error:', error);
      res.redirect(
        `${process.env.FRONTEND_URL}/connected-platforms?error=Twitter connection failed`,
      );
    }
  }

  @UseGuards(JwtOAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
