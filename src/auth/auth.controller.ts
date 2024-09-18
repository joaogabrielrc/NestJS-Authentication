import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { PassportLocalGuard } from './guards/passport-local.guard';
import { PassportJwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(PassportLocalGuard)
  @Post('/login')
  public async login(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<{ message: string }>> {
    const accessToken = await this.authService.signIn(request.user);
    response.cookie('access_token', accessToken, { httpOnly: true });
    return response.send({ message: 'Login successful' });
  }

  @UseGuards(PassportJwtAuthGuard)
  @Get('/me')
  public async getUserPayload(@Req() request: Request) {
    return request.user;
  }
}
