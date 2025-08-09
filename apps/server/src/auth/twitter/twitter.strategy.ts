import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

interface TwitterTokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in?: number;
}

interface TwitterUser {
  id: string;
  username: string;
  name: string;
  profile_image_url?: string;
}

@Injectable()
export class TwitterStrategy {
  private codeVerifiers = new Map<string, string>();
  private clientId: string;
  private callbackURL: string;

  constructor(private configService: ConfigService) {
    this.clientId = configService.get('TWITTER_CLIENT_ID')!;
    this.callbackURL = configService.get('TWITTER_CALLBACK_URL')!;
  }

  getAuthUrl(): string {
    const codeVerifier = crypto.randomBytes(32).toString('base64url');
    const codeChallenge = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');

    const state = crypto.randomBytes(16).toString('hex');
    this.codeVerifiers.set(state, codeVerifier);

    const authParams = {
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.callbackURL,
      scope: 'tweet.read tweet.write users.read offline.access',
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    };

    const query = new URLSearchParams(authParams).toString();
    return `https://twitter.com/i/oauth2/authorize?${query}`;
  }

  async exchangeCodeForToken(code: string, state: string): Promise<any> {
    const codeVerifier = this.codeVerifiers.get(state);
    if (!codeVerifier) {
      throw new Error('Invalid state parameter');
    }

    // Exchange code for tokens
    const tokenParams = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.callbackURL,
      code_verifier: codeVerifier,
    };

    // Use Basic auth with client credentials (confidential client)
    const clientSecret = this.configService.get('TWITTER_CLIENT_SECRET');
    
    if (!clientSecret) {
      throw new Error('TWITTER_CLIENT_SECRET is not configured');
    }
    
    console.log('Token exchange debug:', {
      clientId: this.clientId,
      hasClientSecret: !!clientSecret,
      redirectUri: this.callbackURL,
      codeVerifierLength: codeVerifier.length
    });
    
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams(tokenParams),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Twitter token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error,
        clientId: this.clientId,
        redirectUri: this.callbackURL
      });
      throw new Error(`Token exchange failed: ${error}`);
    }

    const tokens: TwitterTokenResponse = await tokenResponse.json();
    
    // Clean up stored code verifier
    this.codeVerifiers.delete(state);

    // Get user profile using the access token
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
    const user: TwitterUser = userData.data;

    return {
      id: user.id,
      username: user.username,
      firstName: user.name?.split(' ')[0] || user.username,
      lastName: user.name?.split(' ').slice(1).join(' ') || '',
      email: `${user.username}@twitter.com`,
      profileImage: user.profile_image_url,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };
  }
}