import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async authenticate(input: AuthInput): Promise<AuthResult> {
    const userPayload = await this.validateUser(input);

    if (!userPayload) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.signIn(userPayload);

    return {
      userId: userPayload.id,
      email: userPayload.email,
      accessToken,
    };
  }

  private async validateUser({
    email,
    password,
  }: AuthInput): Promise<UserPayload | null> {
    const user = await this.usersService
      .findOneByEmail(email)
      .catch(() => null);

    if (!user || user.password !== password) {
      this.logger.error('Invalid password attempt');
      return null;
    }

    return {
      id: user.id,
      email: user.email,
    };
  }

  private async signIn(userPayload: UserPayload): Promise<string> {
    return await this.jwtService.signAsync({
      sub: userPayload.id,
      email: userPayload.email,
    });
  }
}
