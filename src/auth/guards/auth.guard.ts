import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { LoggerService } from 'src/core/logger/logger.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly loggerService: LoggerService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization; // Bearer <token>
    const token = authorization?.split(' ')[1];

    if (!token) {
      this.loggerService.error('Access Token not found');
      throw new UnauthorizedException('Access Token not found');
    }

    try {
      const { sub, email } = await this.jwtService.verifyAsync(token);
      request.user = { id: sub, email };
      return true;
    } catch (error) {
      this.loggerService.error(error.message);
      throw new UnauthorizedException('Invalid Access Token');
    }
  }
}
