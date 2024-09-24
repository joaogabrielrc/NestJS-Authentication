import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoggerService } from 'src/core/logger/logger.service';

@Injectable()
export class PassportJwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  constructor(private readonly loggerService: LoggerService) {
    super();
  }

  public handleRequest(error: any, user: any, info: any) {
    if (error || !user) {
      this.loggerService.error(info);
      throw error || new UnauthorizedException('Invalid Refresh Token');
    }
    return user;
  }
}
