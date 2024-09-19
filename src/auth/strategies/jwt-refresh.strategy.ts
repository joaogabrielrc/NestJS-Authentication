import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { jwtConstants } from '../config/constants';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  JwtStrategy,
  'jwt-refresh',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.refresh_token,
      ]),
      secretOrKey: jwtConstants.refreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    payload: {
      sub: number;
      email: string;
    },
  ): Promise<UserPayload> {
    const userPayload = await this.authService.veryifyUserRefreshToken(
      request.cookies?.refresh_token,
      payload.sub,
    );

    if (!userPayload) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    return userPayload;
  }
}
