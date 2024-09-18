import { Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PassportLocalGuard extends AuthGuard('local') {
  private readonly logger = new Logger(PassportLocalGuard.name);

  public handleRequest(error: Error, user: any): any {
    if (error || !user) {
      this.logger.error(error);
      throw error || new Error('User not authenticated');
    }
    this.logger.log('User authenticated: ' + user.email);
    return user;
  }
}
