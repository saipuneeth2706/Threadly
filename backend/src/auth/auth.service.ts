import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { User } from '../types';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  googleLogin(req: { user: User }) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  async googleLogout(req: { user: User }) {
    if (req.user && req.user.accessToken) {
      const token = req.user.accessToken;
      try {
        await this.httpService
          .post(`https://oauth2.googleapis.com/revoke?token=${token}`)
          .toPromise();
      } catch (error) {
        // handle error
        console.error(error);
      }
    }
  }
}
