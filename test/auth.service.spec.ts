import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import { LoggerService } from 'src/core/logger/logger.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'password',
    refreshToken: 'some-refresh-token',
  };

  const mockUsersService = {
    findOneByEmail: jest.fn().mockResolvedValue(mockUser),
    findOneByIdAndRefreshToken: jest.fn().mockResolvedValue(mockUser),
    updateRefreshToken: jest.fn().mockResolvedValue(undefined),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('signed-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: LoggerService,
          useValue: {
            setContext: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user payload if validation is successful', async () => {
      const result = await authService.validateUser({
        email: 'test@example.com',
        password: 'password',
      });
      expect(result).toEqual({ id: mockUser.id, email: mockUser.email });
    });

    it('should return null if user is not found', async () => {
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockRejectedValueOnce(
          new NotFoundException('User not found by email'),
        );
      const result = await authService.validateUser({
        email: 'test@example.com',
        password: 'password',
      });
      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValueOnce({
        ...mockUser,
        password: 'wrong-password',
      });
      const result = await authService.validateUser({
        email: 'test@example.com',
        password: 'password',
      });
      expect(result).toBeNull();
    });
  });

  describe('veryifyUserRefreshToken', () => {
    it('should return user payload if refresh token is valid', async () => {
      const result = await authService.veryifyUserRefreshToken(
        'some-refresh-token',
        1,
      );
      expect(result).toEqual({ id: mockUser.id, email: mockUser.email });
    });

    it('should return null if user is not found', async () => {
      jest
        .spyOn(usersService, 'findOneByIdAndRefreshToken')
        .mockRejectedValueOnce(
          new NotFoundException('User not found by id and refresh token'),
        );
      const result = await authService.veryifyUserRefreshToken(
        'some-refresh-token',
        1,
      );
      expect(result).toBeNull();
    });
  });

  describe('veryifyUserEmail', () => {
    it('should return user payload if email is valid', async () => {
      const result = await authService.veryifyUserEmail('test@example.com');
      expect(result).toEqual({ id: mockUser.id, email: mockUser.email });
    });

    it('should return null if user is not found', async () => {
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockRejectedValueOnce(
          new NotFoundException('User not found by email'),
        );
      const result = await authService.veryifyUserEmail('test@example.com');
      expect(result).toBeNull();
    });
  });

  describe('signIn', () => {
    it('should return access and refresh tokens', async () => {
      const result = await authService.signIn({
        id: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        accessToken: 'signed-token',
        refreshToken: 'signed-token',
      });
    });

    it('should update the refresh token in the database', async () => {
      await authService.signIn({
        id: mockUser.id,
        email: mockUser.email,
      });
      expect(usersService.updateRefreshToken).toHaveBeenCalledWith(
        mockUser.id,
        'signed-token',
      );
    });
  });
});
