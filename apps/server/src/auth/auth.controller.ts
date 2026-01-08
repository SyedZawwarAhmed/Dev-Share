import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Delete,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LocalOAuthGuard } from './local/local.oauth.guard';
import { GoogleOAuthGuard } from './google/google.ouath.guard';
import { JwtOAuthGuard } from './jwt/jwt.oauth.guard';
import { LinkedinStrategy } from './linkedin/linkedin.strategy';
import { TwitterStrategy } from './twitter/twitter.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private linkedinStrategy: LinkedinStrategy,
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
  async linkedinAuth(@Res() res: Response) {
    const authUrl = this.linkedinStrategy.getAuthUrl();
    res.redirect(authUrl);
  }

  @Get('linkedin/callback')
  async linkedinAuthCallback(@Req() req, @Res() res: Response) {
    try {
      const { code, state, error } = req.query;

      if (error) {
        throw new Error(`LinkedIn OAuth error: ${error}`);
      }

      if (!code || !state) {
        throw new Error('Missing code or state parameter');
      }

      const linkedinProfile = await this.linkedinStrategy.exchangeCodeForToken(
        code as string,
        state as string,
      );

      const { token } = await this.authService.linkedinLogin(linkedinProfile);
      const redirectUrl = new URL('/callback', process.env.FRONTEND_URL);
      redirectUrl.searchParams.append('token', encodeURIComponent(token));
      res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('LinkedIn OAuth callback error:', error);
      res.redirect(
        `${process.env.FRONTEND_URL}/login?error=LinkedIn authentication failed`,
      );
    }
  }

  @Get('twitter')
  async twitterAuth(@Res() res: Response) {
    const authUrl = this.twitterStrategy.getAuthUrl();
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
        throw new Error('Missing code or state parameter');
      }

      const twitterProfile = await this.twitterStrategy.exchangeCodeForToken(
        code as string,
        state as string,
      );

      const { token } = await this.authService.twitterLogin(twitterProfile);

      const redirectUrl = new URL('/callback', process.env.FRONTEND_URL);
      redirectUrl.searchParams.append('token', encodeURIComponent(token));
      res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('Twitter OAuth callback error:', error);
      res.redirect(
        `${process.env.FRONTEND_URL}/login?error=Twitter authentication failed`,
      );
    }
  }

  @UseGuards(JwtOAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtOAuthGuard)
  @Delete('disconnect/:provider')
  async disconnectAccount(@Req() req, @Param('provider') provider: string) {
    return this.authService.disconnectAccount(req.user.id, provider);
  }
}
