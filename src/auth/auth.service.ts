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

  public async authenticate(input: AuthInput): Promise<UserPayload> {
    const userPayload = await this.validateUser(input);

    if (!userPayload) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return await this.signIn(userPayload);
  }

  private async validateUser({
    email,
    password,
  }: AuthInput): Promise<SignInData | null> {
    const user = await this.usersService
      .findOneByEmail(email)
      .catch(() => null);

    if (!user || user.password !== password) {
      this.logger.error('Invalid password attempt');
      return null;
    }

    return {
      userId: user.id,
      email: user.email,
    };
  }

  private async signIn(payload: SignInData): Promise<UserPayload> {
    const accessToken = await this.jwtService.signAsync({
      sub: payload.userId,
      email: payload.email,
    });

    return {
      sub: payload.userId,
      email: payload.email,
      accessToken,
    };
  }
}
