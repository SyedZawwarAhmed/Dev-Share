import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

interface LinkedinTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  scope: string;
}

interface LinkedinUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  given_name: string;
  family_name: string;
  picture?: string;
}

@Injectable()
export class LinkedinStrategy {
  private stateTokens = new Map<string, { timestamp: number }>();
  private clientId: string;
  private clientSecret: string;
  private callbackURL: string;

  constructor(private configService: ConfigService) {
    this.clientId = configService.get('LINKEDIN_CLIENT_ID')!;
    this.clientSecret = configService.get('LINKEDIN_CLIENT_SECRET')!;
    this.callbackURL = configService.get('LINKEDIN_CALLBACK_URL')!;
  }

  getAuthUrl(): string {
    const state = crypto.randomBytes(16).toString('hex');
    this.stateTokens.set(state, { timestamp: Date.now() });

    // Clean up old state tokens (older than 10 minutes)
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    this.stateTokens.forEach((value, key) => {
      if (value.timestamp < tenMinutesAgo) {
        this.stateTokens.delete(key);
      }
    });

    const authParams = {
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.callbackURL,
      scope: 'openid profile email w_member_social',
      state: state,
    };

    const query = new URLSearchParams(authParams).toString();
    return `https://www.linkedin.com/oauth/v2/authorization?${query}`;
  }

  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    maxRetries = 3,
    timeoutMs = 30000,
  ): Promise<Response> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response;
      } catch (error: any) {
        lastError = error;
        console.warn(
          `LinkedIn API request attempt ${attempt}/${maxRetries} failed:`,
          error.message,
        );

        if (attempt < maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('All retry attempts failed');
  }

  async exchangeCodeForToken(code: string, state: string): Promise<any> {
    // Validate state
    if (!this.stateTokens.has(state)) {
      throw new Error('Invalid state parameter');
    }
    this.stateTokens.delete(state);

    // Exchange code for tokens
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.callbackURL,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    console.log('LinkedIn token exchange starting...');

    const tokenResponse = await this.fetchWithRetry(
      'https://www.linkedin.com/oauth/v2/accessToken',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: tokenParams,
      },
    );

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('LinkedIn token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error,
      });
      throw new Error(`Token exchange failed: ${error}`);
    }

    const tokens: LinkedinTokenResponse = await tokenResponse.json();
    console.log('LinkedIn token exchange successful');

    // Get user profile using the access token
    console.log('Fetching LinkedIn user profile...');
    const userResponse = await this.fetchWithRetry(
      'https://api.linkedin.com/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      },
    );

    if (!userResponse.ok) {
      const error = await userResponse.text();
      console.error('LinkedIn user profile fetch failed:', {
        status: userResponse.status,
        statusText: userResponse.statusText,
        error,
      });
      throw new Error(`Failed to get user profile: ${error}`);
    }

    const user: LinkedinUserInfo = await userResponse.json();
    console.log('LinkedIn user profile fetched successfully');

    const displayName =
      [user.given_name, user.family_name].filter(Boolean).join(' ') ||
      undefined;

    return {
      id: user.sub,
      email: user.email,
      firstName: user.given_name,
      lastName: user.family_name,
      profileImage: user.picture,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      displayName,
    };
  }
}
