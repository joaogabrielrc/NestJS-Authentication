import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

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

  public async signIn(userPayload: UserPayload): Promise<string> {
    return await this.jwtService.signAsync({
      sub: userPayload.id,
      email: userPayload.email,
    });
  }
}
