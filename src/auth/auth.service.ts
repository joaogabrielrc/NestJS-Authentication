import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './config/constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser({
    email,
    password,
  }: AuthInput): Promise<UserPayload | null> {
    const user = await this.usersService
      .findOneByEmail(email)
      .catch(() => null);

    if (!user) {
      this.logger.error('User not found');
      return null;
    }

    if (user.password !== password) {
      this.logger.error('Invalid password attempt');
      return null;
    }

    return {
      id: user.id,
      email: user.email,
    };
  }

  public async veryifyUserRefreshToken(
    refreshToken: string,
    userId: number,
  ): Promise<UserPayload | null> {
    const user = await this.usersService
      .findOneByIdAndRefreshToken(userId, refreshToken)
      .catch(() => null);

    if (!user) {
      this.logger.error('User not found');
      return null;
    }

    return {
      id: user.id,
      email: user.email,
    };
  }

  public async signIn(userPayload: UserPayload): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(userPayload),
      this.generateRefreshToken(userPayload),
    ]);

    await this.usersService.updateRefreshToken(userPayload.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateAccessToken(userPayload: UserPayload): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: userPayload.id,
        email: userPayload.email,
      },
      {
        secret: jwtConstants.secret,
        expiresIn: '60s',
      },
    );
  }

  private async generateRefreshToken(
    userPayload: UserPayload,
  ): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: userPayload.id,
        email: userPayload.email,
      },
      {
        secret: jwtConstants.refreshSecret,
        expiresIn: '7d',
      },
    );
  }
}
