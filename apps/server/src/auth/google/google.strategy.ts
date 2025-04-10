import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      callbackURL: 'http://localhost:3000/auth/google-redirect',
      scope: ['email', 'profile'],
      passReqToCallback: false,
    });
  }
  validate(
    accessToken: string,
    refreshToken: string,
    profile: {
      name: { givenName: string; familyName: string };
      emails: { value: string }[];
      photos: { value: string }[];
    },
    done: VerifyCallback,
  ) {
    console.log(
      '\n\n ---> apps/server/src/auth/google/google.strategy.ts:25 -> profile: ',
      profile,
    );
    const { name, emails, photos } = profile;
    const user = {
      email: emails?.[0].value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      picture: photos?.[0].value,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
