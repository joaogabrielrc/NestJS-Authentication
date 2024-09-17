import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthInput } from './interfaces/auth';
import { AuthService } from './auth.service';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  public async login(@Body() input: AuthInput) {
    return await this.authService.authenticate(input);
  }
}
