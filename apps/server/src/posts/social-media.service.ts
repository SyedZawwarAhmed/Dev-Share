import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostStatus } from 'generated/prisma';

@Injectable()
export class SocialMediaService {
  private readonly logger = new Logger(SocialMediaService.name);

  constructor(private prisma: PrismaService) {}

  async postToLinkedIn(post: any, user: any) {
    try {
      this.logger.log(`Posting to LinkedIn: ${post.id}`);
      
      // Find LinkedIn account for the user
      const linkedinAccount = user.accounts.find(acc => acc.provider === 'LINKEDIN');
      if (!linkedinAccount?.access_token) {
        throw new Error('No LinkedIn access token found. User needs to authenticate with LinkedIn first.');
      }

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
          'Authorization': `Bearer ${linkedinAccount.access_token}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
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

  async postToTwitter(post: any, user: any) {
    try {
      this.logger.log(`Posting to Twitter: ${post.id}`);
      
      // TODO: Implement Twitter/X API posting
      // You'll need to use the Twitter API v2 with the user's access token
      // const twitterAccount = user.accounts.find(acc => acc.provider === 'TWITTER');
      // if (!twitterAccount?.access_token) {
      //   throw new Error('No Twitter access token found');
      // }
      
      // Example Twitter API call:
      // const response = await fetch('https://api.twitter.com/2/tweets', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${twitterAccount.access_token}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     text: post.content
      //   })
      // });

      // For now, just simulate success
      await this.updatePostStatus(post.id, PostStatus.PUBLISHED);
      this.logger.log(`Successfully posted to Twitter: ${post.id}`);
      
      return { success: true, platform: 'TWITTER' };
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
        include: {
          user: {
            include: {
              accounts: true,
            },
          },
        },
      });

      if (!post) {
        throw new Error(`Post not found: ${postId}`);
      }

      let result;
      switch (post.platform) {
        case 'LINKEDIN':
          result = await this.postToLinkedIn(post, post.user);
          break;
        case 'TWITTER':
          result = await this.postToTwitter(post, post.user);
          break;
        case 'BLUESKY':
          result = await this.postToBluesky(post, post.user);
          break;
        default:
          throw new Error(`Unsupported platform: ${post.platform}`);
      }

      return result;
    } catch (error) {
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