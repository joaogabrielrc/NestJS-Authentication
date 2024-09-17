import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization; // Bearer <token>
    const token = authorization?.split(' ')[1];

    if (!token) {
      this.logger.error('Access Token not found');
      throw new UnauthorizedException('Access Token not found');
    }

    try {
      const { sub, email } = await this.jwtService.verifyAsync(token);
      request.user = { sub, email };
      return true;
    } catch (error) {
      this.logger.error(error.message);
      throw new UnauthorizedException('Invalid Access Token');
    }
  }
}
