import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('GOOGLE_AUTH_CLIENT_ID') ?? 'default',
      clientSecret: configService.get('GOOGLE_AUTH_CLIENT_SECRET') ?? 'default',
      callbackURL: configService.get('GOOGLE_AUTH_REDIRECT_URI') ?? 'default',
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<UserPayload> {
    const email = profile?.emails?.at(0)?.value;

    if (!email) {
      throw new UnauthorizedException('Email not found in Google profile');
    }

    const userPayload = await this.authService.veryifyUserEmail(email);

    if (!userPayload) {
      throw new UnauthorizedException('Invalid google email account');
    }

    return userPayload;
  }
}
