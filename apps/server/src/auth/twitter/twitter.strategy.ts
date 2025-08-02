import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwitterStrategy {
  constructor(private configService: ConfigService) {}

  getAuthUrl(state: string): string {
    const clientId = this.configService.get('TWITTER_CLIENT_ID');
    const redirectUri = this.configService.get('TWITTER_CALLBACK_URL');
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'tweet.read tweet.write users.read offline.access',
      state,
      code_challenge: 'challenge',
      code_challenge_method: 'plain',
    });

    return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<any> {
    const clientId = this.configService.get('TWITTER_CLIENT_ID');
    const clientSecret = this.configService.get('TWITTER_CLIENT_SECRET');
    const redirectUri = this.configService.get('TWITTER_CALLBACK_URL');

    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: 'challenge',
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      throw new Error(`Token exchange failed: ${error}`);
    }

    const tokens = await tokenResponse.json();
    
    // Get user profile
    const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,name,username', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      const error = await userResponse.text();
      throw new Error(`Failed to get user profile: ${error}`);
    }

    const userData = await userResponse.json();
    const user = userData.data;

    return {
      id: user.id,
      username: user.username,
      firstName: user.name?.split(' ')[0] || user.username,
      lastName: user.name?.split(' ').slice(1).join(' ') || '',
      email: `${user.username}@twitter.com`, // Twitter doesn't provide email in OAuth 2.0
      profileImage: user.profile_image_url,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };
  }
}