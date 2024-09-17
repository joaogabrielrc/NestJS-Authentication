import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthInput, AuthResult, SignInData } from './interfaces/auth';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly usersService: UsersService) {}

  public async authenticate(input: AuthInput): Promise<AuthResult> {
    const { userId, email } = await this.validateUser(input);

    return {
      userId,
      email,
      accessToken: 'fake-access',
    };
  }

  private async validateUser({
    email,
    password,
  }: AuthInput): Promise<SignInData> {
    const user = await this.usersService.findOneByEmail(email).catch(() => {
      throw new UnauthorizedException('Invalid credentials');
    });

    if (user.password !== password) {
      this.logger.error('Invalid password attempt');
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      userId: user.id,
      email: user.email,
    };
  }
}
