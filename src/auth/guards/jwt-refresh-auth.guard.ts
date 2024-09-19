import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PassportJwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  private readonly logger = new Logger(PassportJwtRefreshAuthGuard.name);

  public handleRequest(error: any, user: any, info: any) {
    if (error || !user) {
      this.logger.error(info);
      throw error || new UnauthorizedException('Invalid Refresh Token');
    }
    return user;
  }
}
