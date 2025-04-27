import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  Param,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { CreateUserDto } from 'src/users/dto/create-user.dto';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() body: CreateUserDto) {
    return await this.authService.signUp(body);
  }

  @Post('signin')
  @HttpCode(200)
  async signIn(
    @Body() body: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data } = await this.authService.signIn(body);

    res.cookie('token', data.accessToken, {
      httpOnly: true, // ป้องกัน XSS โจมตี
      secure: process.env.NODE_ENV === 'production', // ใช้ HTTPS เท่านั้นถ้า prod
      sameSite: 'strict', // ปลอดภัยเพิ่ม
      maxAge: 1000 * 60 * 60, // 1 ชั่วโมง
    });

    return data;
  }

  @Post('logout')
  @HttpCode(200)
  async logout(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(id);

    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { message: 'Logout successful' };
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth('access-token')
  @Post('refresh-token')
  @HttpCode(200)
  refreshToken(@Headers('authorization') authorization: string) {
    const refreshToken = authorization?.split(' ')[1]; // ตัด Bearer ออก

    if (!refreshToken) {
      throw new Error('Refresh token is missing');
    }

    return this.authService.refreshTokens(refreshToken);
  }
}
