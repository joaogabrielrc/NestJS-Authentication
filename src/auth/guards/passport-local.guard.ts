import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoggerService } from 'src/core/logger/logger.service';

@Injectable()
export class PassportLocalGuard extends AuthGuard('local') {
  constructor(private readonly loggerService: LoggerService) {
    super();
  }

  public handleRequest(error: Error, user: any): any {
    if (error || !user) {
      this.loggerService.error(error);
      throw error || new Error('User not authenticated');
    }
    this.loggerService.log('User authenticated: ' + user.email);
    return user;
  }
}
