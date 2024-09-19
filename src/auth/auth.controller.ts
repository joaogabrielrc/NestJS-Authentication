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
import { PassportJwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';

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
    const { accessToken, refreshToken } = await this.authService.signIn(
      request.user,
    );
    response.cookie('access_token', accessToken, { httpOnly: true });
    response.cookie('refresh_token', refreshToken, { httpOnly: true });
    return response.send({ message: 'Login successful' });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(PassportJwtRefreshAuthGuard)
  @Post('/refresh')
  public async refresh(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<{ message: string }>> {
    const { accessToken, refreshToken } = await this.authService.signIn(
      request.user,
    );
    response.cookie('access_token', accessToken, { httpOnly: true });
    response.cookie('refresh_token', refreshToken, { httpOnly: true });
    return response.send({ message: 'Refresh successful' });
  }

  @UseGuards(PassportJwtAuthGuard)
  @Get('/me')
  public async getUserPayload(@Req() request: Request) {
    return request.user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  public async logout(
    @Res() response: Response,
  ): Promise<Response<{ message: string }>> {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    return response.send({ message: 'Logged out successfully' });
  }
}
