import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { Request } from 'express';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  public async login(@Body() input: AuthInput) {
    return await this.authService.authenticate(input);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  public async getUserPayload(@Req() request: Request) {
    return request.user;
  }
}
