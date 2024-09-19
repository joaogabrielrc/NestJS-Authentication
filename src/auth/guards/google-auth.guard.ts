import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  handleRequest<TUser = any>(
    error: any,
    user: any,
    _info: any,
    context: ExecutionContext,
  ): TUser {
    const response = context.switchToHttp().getResponse();

    if (error || !user) {
      response.clearCookie('access_token');
      response.clearCookie('refresh_token');
      const redirectUrl = this.configService.getOrThrow(
        'FRONTEND_REDIRECT_URI',
      );
      response.redirect(redirectUrl);
    }

    return user;
  }
}
