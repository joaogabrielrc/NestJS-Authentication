import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../src/users/users.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    module.useLogger(false);

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByEmail', () => {
    it('should return a user if email exists', async () => {
      const user = await service.findOneByEmail('alice@mail.com');
      expect(user).toBeDefined();
      expect(user.email).toBe('alice@mail.com');
    });

    it('should throw NotFoundException if email does not exist', async () => {
      await expect(
        service.findOneByEmail('nonexistent@mail.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneByIdAndRefreshToken', () => {
    it('should return a user if id and refresh token match', async () => {
      await service.updateRefreshToken(1, 'newToken');
      const user = await service.findOneByIdAndRefreshToken(1, 'newToken');
      expect(user).toBeDefined();
      expect(user.id).toBe(1);
      expect(user.refreshToken).toBe('newToken');
    });

    it('should throw NotFoundException if id and refresh token do not match', async () => {
      await expect(
        service.findOneByIdAndRefreshToken(1, 'wrongToken'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateRefreshToken', () => {
    it('should update the refresh token of the user', async () => {
      await service.updateRefreshToken(1, 'newToken');
      const user = await service.findOneByEmail('alice@mail.com');
      expect(user.refreshToken).toBe('newToken');
    });

    it('should throw NotFoundException if user id does not exist', async () => {
      await expect(service.updateRefreshToken(999, 'newToken')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
