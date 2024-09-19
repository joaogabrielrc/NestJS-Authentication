import { Injectable, Logger, NotFoundException } from '@nestjs/common';

const users: User[] = [
  {
    id: 1,
    email: 'alice@mail.com',
    password: '1234',
    refreshToken: null,
  },
  {
    id: 2,
    email: 'bob@mail.com',
    password: '5678',
    refreshToken: null,
  },
];

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  public async findOneByEmail(email: string): Promise<User> {
    const user = users.find((user) => user.email === email);
    if (!user) {
      this.logger.error(`User not found by email: ${email}`);
      throw new NotFoundException('User not found by email');
    }
    return user;
  }

  public async findOneByIdAndRefreshToken(
    id: number,
    refreshToken: string,
  ): Promise<User> {
    const user = users.find(
      (user) => user.id === id && user.refreshToken === refreshToken,
    );
    if (!user) {
      this.logger.error(`User not found by id: ${id} and refresh token`);
      throw new NotFoundException('User not found by id and refresh token');
    }
    return user;
  }

  public async updateRefreshToken(
    id: number,
    refreshToken: string,
  ): Promise<void> {
    const user = users.find((user) => user.id === id);
    if (!user) {
      this.logger.error(`User not found by id: ${id}`);
      throw new NotFoundException('User not found by id');
    }
    user.refreshToken = refreshToken;
  }
}
