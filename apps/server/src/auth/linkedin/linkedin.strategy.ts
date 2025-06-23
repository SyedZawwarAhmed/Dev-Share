import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LinkedinStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('LINKEDIN_CLIENT_ID'),
      clientSecret: configService.get('LINKEDIN_CLIENT_SECRET'),
      callbackURL: `${configService.get('LINKEDIN_CALLBACK_URL')}`,
      scope: ['w_member_social', 'openid', 'profile', 'email'],
      state: true,
      profileFields: [
        'id',
        'first-name',
        'last-name',
        'email-address',
        'profile-picture',
      ],
      auth: {
        auth_type: 'authenticate',
      },
      passReqToCallback: false,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    const { id, email, givenName, familyName, picture } = profile;
    const user = {
      email,
      id,
      firstName: givenName,
      lastName: familyName,
      profileImage: picture,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
