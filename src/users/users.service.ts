import { Injectable, Logger, NotFoundException } from '@nestjs/common';

const users: User[] = [
  {
    id: 1,
    email: 'alice@mail.com',
    password: '1234',
  },
  {
    id: 2,
    email: 'bob@mail.com',
    password: '5678',
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
}
