import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from '@prisma/client';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { JwtType, RequestWithUser } from 'src/interfaces/auth.interface';
import { UsersService } from '../users/users.service';
import { UtilsService } from '../utils/utils.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly utilsService: UtilsService,
  ) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterUserDto): Promise<User> {
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async signIn(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.usersService.findById(req.user.id);
    const access_token = await this.utilsService.generateToken(
      user.id,
      user.email,
      JwtType.ACCESS_TOKEN,
    );
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return user;
  }
}
