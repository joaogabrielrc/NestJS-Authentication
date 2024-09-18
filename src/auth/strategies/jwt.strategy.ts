import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { jwtConstants } from '../config/constants';

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(JwtStrategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let token = null;
          if (request && request.cookies) {
            token = request.cookies['access_token'];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
  }): Promise<UserPayload> {
    return { id: payload.sub, email: payload.email };
  }
}
