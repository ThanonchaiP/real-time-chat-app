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

@ApiTags('Auth')
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

    this.setAuthCookies(res, data.accessToken, data.refreshToken);

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

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const isProd = process.env.NODE_ENV === 'production';

    const baseCookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict' as const,
    };

    res.cookie('access_token', accessToken, {
      ...baseCookieOptions,
      maxAge: 1000 * 60 * 60 * 24, // 1 วัน
    });

    res.cookie('refresh_token', refreshToken, {
      ...baseCookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 วัน
    });
  }
}
