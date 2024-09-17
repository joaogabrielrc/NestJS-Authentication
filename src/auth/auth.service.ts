import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthInput, AuthResult, SignInData } from './interfaces/auth';
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

  private async signIn(payload: SignInData): Promise<AuthResult> {
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      userId: payload.userId,
      email: payload.email,
      accessToken,
    };
  }
}
