import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { clearAuthCookies, setAuthCookies } from '@/auth/helper';
import { JwtCookieAuthGuard } from '@/common/guards/jwt-cookie.guard';
import { JwtRefreshGuard } from '@/common/guards/jwt-refresh.guard';
import { CreateUserDto } from '@/users/dto/create-user.dto';

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

    setAuthCookies(res, data.accessToken, data.refreshToken);

    return data;
  }

  @UseGuards(JwtCookieAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['access_token'];

    await this.authService.logout(token);
    clearAuthCookies(res);

    return { message: 'Logout successful' };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new Error('Refresh token is missing');
    }

    const { data } = await this.authService.refreshTokens(refreshToken, res);
    setAuthCookies(res, data.accessToken, data.refreshToken);

    return data;
  }

  @UseGuards(JwtCookieAuthGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    const token = req.cookies['access_token'];
    return this.authService.getMe(token);
  }
}
