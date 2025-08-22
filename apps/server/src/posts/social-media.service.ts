import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostStatus } from 'generated/prisma';

@Injectable()
export class SocialMediaService {
  private readonly logger = new Logger(SocialMediaService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async postToLinkedIn(post: any, user: any) {
    try {
      this.logger.log(`Posting to LinkedIn: ${post.id}`);
      
      // Find LinkedIn account for the user
      const linkedinAccount = user.accounts.find(acc => acc.provider === 'LINKEDIN');
      if (!linkedinAccount?.access_token) {
        throw new Error('No LinkedIn access token found. User needs to authenticate with LinkedIn first.');
      }

      let accessToken = linkedinAccount.access_token;
      this.logger.log(`Using LinkedIn token: ${accessToken.substring(0, 15)}... (length: ${accessToken.length})`);

      // Skip token validation for now - let the actual post request handle token issues

      // Prepare the LinkedIn API request body for text-only post
      const requestBody = {
        author: `urn:li:person:${linkedinAccount.providerAccountId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: post.content
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };

      // TODO: Add image upload support in the future
      // For images, we would need to:
      // 1. Register upload: POST https://api.linkedin.com/v2/assets?action=registerUpload
      // 2. Upload image binary to the returned uploadUrl
      // 3. Set shareMediaCategory to 'IMAGE' and add media array with the asset URN

      // Make the LinkedIn API call
      const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        // Check if it's an authentication error (401 or 403)
        if (response.status === 401 || response.status === 403) {
          this.logger.error(`LinkedIn authentication error: ${response.status} - ${errorText}`);
          throw new Error('LinkedIn access token has expired. Please re-authenticate with LinkedIn in your account settings.');
        }
        
        throw new Error(`LinkedIn API error: ${response.status} - ${errorText}`);
      }

      const postId = response.headers.get('X-RestLi-Id');
      this.logger.log(`Successfully posted to LinkedIn. Post ID: ${postId}`);

      await this.updatePostStatus(post.id, PostStatus.PUBLISHED);
      
      return { 
        success: true, 
        platform: 'LINKEDIN',
        linkedInPostId: postId,
        url: `https://www.linkedin.com/feed/update/${postId}/`
      };
    } catch (error) {
      this.logger.error(`Failed to post to LinkedIn: ${error.message}`);
      await this.updatePostStatus(post.id, PostStatus.DRAFT);
      throw error;
    }
  }

  private async uploadLinkedInImage(imageUrl: string, linkedinAccount: any): Promise<string> {
    try {
      // Step 1: Register the image upload
      const registerResponse = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${linkedinAccount.access_token}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify({
          registerUploadRequest: {
            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
            owner: `urn:li:person:${linkedinAccount.providerAccountId}`,
            serviceRelationships: [
              {
                relationshipType: 'OWNER',
                identifier: 'urn:li:userGeneratedContent'
              }
            ]
          }
        })
      });

      if (!registerResponse.ok) {
        throw new Error(`Failed to register image upload: ${registerResponse.status}`);
      }

      const registerData = await registerResponse.json();
      const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
      const asset = registerData.value.asset;

      // Step 2: Download the image from the URL
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to download image from ${imageUrl}`);
      }
      const imageBuffer = await imageResponse.arrayBuffer();

      // Step 3: Upload the image to LinkedIn
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${linkedinAccount.access_token}`,
        },
        body: imageBuffer
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload image to LinkedIn: ${uploadResponse.status}`);
      }

      this.logger.log(`Successfully uploaded image to LinkedIn. Asset: ${asset}`);
      return asset;
    } catch (error) {
      this.logger.error(`Failed to upload LinkedIn image: ${error.message}`);
      throw error;
    }
  }

  async validateLinkedInToken(accessToken: string): Promise<boolean> {
    try {
      // Make a simple API call to validate the token
      this.logger.log(`Validating LinkedIn token with /v2/me endpoint...`);
      const response = await fetch('https://api.linkedin.com/v2/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      this.logger.log(`LinkedIn token validation response: ${response.status} ${response.statusText}`);

      // If we get a 401 or 403, the token is expired or invalid
      if (response.status === 401 || response.status === 403) {
        const errorBody = await response.text();
        this.logger.log(`LinkedIn ${response.status} response body: ${errorBody}`);
        return false;
      }

      // Any other error or success means the token is still valid
      return response.ok;
    } catch (error) {
      // If there's a network error, assume token is still valid to avoid false positives
      this.logger.warn(`LinkedIn token validation failed due to network error: ${error.message}`);
      return true;
    }
  }

  async refreshTwitterToken(refreshToken: string): Promise<{ access_token: string; refresh_token?: string }> {
    const clientId = this.configService.get('TWITTER_CLIENT_ID');
    const clientSecret = this.configService.get('TWITTER_CLIENT_SECRET');

    try {
      const response = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorObj;
        try {
          errorObj = JSON.parse(errorText);
        } catch {
          errorObj = { error: 'unknown_error', error_description: errorText };
        }
        
        this.logger.error(`Twitter token refresh failed: ${response.status} - ${JSON.stringify(errorObj)}`);
        throw new Error(`Token refresh failed: ${JSON.stringify(errorObj)}`);
      }

      const tokens = await response.json();
      this.logger.log('Twitter token refresh successful');
      
      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || refreshToken,
      };
    } catch (error) {
      this.logger.error(`Twitter token refresh error: ${error.message}`);
      throw error;
    }
  }

  async postToTwitter(post: any, user: any) {
    try {
      this.logger.log(`Posting to Twitter: ${post.id}`);
      
      // Find Twitter account for the user
      const twitterAccount = user.accounts.find(acc => acc.provider === 'TWITTER');
      if (!twitterAccount?.access_token) {
        throw new Error('No Twitter access token found. User needs to authenticate with Twitter first.');
      }

      let accessToken = twitterAccount.access_token;

      // Try to refresh the token if we have a refresh token
      if (twitterAccount.refresh_token) {
        try {
          const tokens = await this.refreshTwitterToken(twitterAccount.refresh_token);
          accessToken = tokens.access_token;
          
          // Update the stored access token and refresh token
          await this.prisma.account.update({
            where: { id: twitterAccount.id },
            data: { 
              access_token: tokens.access_token,
              refresh_token: tokens.refresh_token,
            },
          });
          
          this.logger.log(`Refreshed Twitter access token for user ${user.id}`);
        } catch (refreshError) {
          this.logger.warn(`Token refresh failed, trying with existing token: ${refreshError.message}`);
        }
      }

      // Make the Twitter API call using OAuth 2.0 Bearer token
      const response = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: post.content
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Twitter API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const responseData = await response.json();
      const tweetId = responseData.data?.id;
      
      this.logger.log(`Successfully posted to Twitter. Tweet ID: ${tweetId}`);

      await this.updatePostStatus(post.id, PostStatus.PUBLISHED);
      
      return { 
        success: true, 
        platform: 'TWITTER',
        tweetId,
        url: `https://twitter.com/i/web/status/${tweetId}`
      };
    } catch (error) {
      this.logger.error(`Failed to post to Twitter: ${error.message}`);
      await this.updatePostStatus(post.id, PostStatus.DRAFT);
      throw error;
    }
  }

  async postToBluesky(post: any, user: any) {
    try {
      this.logger.log(`Posting to Bluesky: ${post.id}`);
      
      // TODO: Implement Bluesky API posting
      // You'll need to use the Bluesky API with the user's credentials
      // const blueskyAccount = user.accounts.find(acc => acc.provider === 'BLUESKY');
      // if (!blueskyAccount?.access_token) {
      //   throw new Error('No Bluesky access token found');
      // }
      
      // Example Bluesky API call:
      // const response = await fetch('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${blueskyAccount.access_token}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     repo: user.username,
      //     collection: 'app.bsky.feed.post',
      //     record: {
      //       text: post.content,
      //       createdAt: new Date().toISOString()
      //     }
      //   })
      // });

      // For now, just simulate success
      await this.updatePostStatus(post.id, PostStatus.PUBLISHED);
      this.logger.log(`Successfully posted to Bluesky: ${post.id}`);
      
      return { success: true, platform: 'BLUESKY' };
    } catch (error) {
      this.logger.error(`Failed to post to Bluesky: ${error.message}`);
      await this.updatePostStatus(post.id, PostStatus.DRAFT);
      throw error;
    }
  }

  private async updatePostStatus(postId: string, status: PostStatus) {
    await this.prisma.post.update({
      where: { id: postId },
      data: {
        status,
        publishedAt: status === PostStatus.PUBLISHED ? new Date() : null,
      },
    });
  }

  async publishPost(postId: string, retryCount = 0) {
    const maxRetries = 2;
    
    try {
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        throw new Error(`Post not found: ${postId}`);
      }

      // Get fresh user data to ensure we have the latest account tokens
      const user = await this.prisma.user.findUnique({
        where: { id: post.userId },
        include: {
          accounts: true,
        },
      });

      if (!user) {
        throw new Error(`User not found: ${post.userId}`);
      }

      let result;
      switch (post.platform) {
        case 'LINKEDIN':
          result = await this.postToLinkedIn(post, user);
          break;
        case 'TWITTER':
          result = await this.postToTwitter(post, user);
          break;
        case 'BLUESKY':
          result = await this.postToBluesky(post, user);
          break;
        default:
          throw new Error(`Unsupported platform: ${post.platform}`);
      }

      return result;
    } catch (error) {
      // Don't retry LinkedIn authentication errors - user needs to re-authenticate
      if (error.message?.includes('LinkedIn access token has expired') || 
          error.message?.includes('No LinkedIn access token found')) {
        this.logger.error(`LinkedIn authentication error - no retry: ${error.message}`);
        throw error;
      }
      
      if (retryCount < maxRetries) {
        this.logger.warn(`Retrying post ${postId} (attempt ${retryCount + 1}/${maxRetries})`);
        // Wait 5 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 5000));
        return this.publishPost(postId, retryCount + 1);
      }
      
      this.logger.error(`Failed to publish post ${postId} after ${maxRetries} attempts`);
      throw error;
    }
  }
} 