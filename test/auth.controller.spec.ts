import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as request from 'supertest';
import { AuthService } from 'src/auth/auth.service';
import { PassportLocalGuard } from 'src/auth/guards/passport-local.guard';
import { PassportJwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PassportJwtRefreshAuthGuard } from 'src/auth/guards/jwt-refresh-auth.guard';
import { GoogleAuthGuard } from 'src/auth/guards/google-auth.guard';
import { AuthController } from 'src/auth/auth.controller';

describe('AuthController', () => {
  let app: INestApplication;
  const authService = { signIn: jest.fn() };
  const configService = { getOrThrow: jest.fn() };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ConfigService, useValue: configService },
      ],
    })
      .overrideGuard(PassportLocalGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(PassportJwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(PassportJwtRefreshAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(GoogleAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/POST login', () => {
    authService.signIn.mockResolvedValue({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .expect(200)
      .expect('Set-Cookie', /access_token/)
      .expect('Set-Cookie', /refresh_token/)
      .expect({ message: 'Login successful' });
  });

  it('/POST refresh', () => {
    authService.signIn.mockResolvedValue({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    return request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .expect(200)
      .expect('Set-Cookie', /access_token/)
      .expect('Set-Cookie', /refresh_token/)
      .expect({ message: 'Refresh successful' });
  });

  it('/GET google/login', () => {
    return request(app.getHttpServer())
      .get('/api/v1/auth/google/login')
      .expect(200);
  });

  it('/GET google/redirect', () => {
    authService.signIn.mockResolvedValue({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });
    configService.getOrThrow.mockReturnValue('http://localhost:3000');

    return request(app.getHttpServer())
      .get('/api/v1/auth/google/redirect')
      .expect(302)
      .expect('Set-Cookie', /access_token/)
      .expect('Set-Cookie', /refresh_token/)
      .expect('Location', 'http://localhost:3000');
  });

  it('/GET me', () => {
    return request(app.getHttpServer()).get('/api/v1/auth/me').expect(200);
  });

  it('/POST logout', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .expect(200)
      .expect('Set-Cookie', /access_token=;/)
      .expect('Set-Cookie', /refresh_token=;/)
      .expect({ message: 'Logged out successfully' });
  });

  afterAll(async () => {
    await app.close();
  });
});
