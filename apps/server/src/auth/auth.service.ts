import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  googleLogin(req: { user: User }) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }
}
