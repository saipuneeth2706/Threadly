import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/gmail.readonly',
      ],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): void {
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
