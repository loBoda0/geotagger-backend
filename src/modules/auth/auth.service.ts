import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from '@prisma/client';
import { compareHash, hash } from 'src/utils/bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findBy(email);
    if (!user) {
      throw new BadRequestException('User with this email does not exist.');
    }
    if (!(await compareHash(password, user.password))) {
      throw new BadRequestException('Password is not correct.');
    }
    return user;
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const hashedPassword = await hash(registerUserDto.password);
    const user = await this.usersService.create({
      ...registerUserDto,
      password: hashedPassword,
    });

    return user;
  }
}
