import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PassportJwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(PassportJwtAuthGuard.name);

  public handleRequest(error: any, user: any, info: any) {
    if (error || !user) {
      this.logger.error(info);
      throw error || new UnauthorizedException('Invalid Access Token');
    }
    return user;
  }
}
