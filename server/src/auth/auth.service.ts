import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { Response } from 'express';
import { Model, Types } from 'mongoose';

import { clearAuthCookies } from '@/auth/helper';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import { TokenPayload } from '@/types';

import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  async signIn(body: SignInDto) {
    const { email, password } = body;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Incorrect username or password.');
    }

    const isValid = await argon2.verify(user.password, password);
    if (!isValid) {
      throw new UnauthorizedException('Incorrect username or password.');
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return { data: { user: user._id, ...tokens } };
  }

  async logout(accessToken: string) {
    const payload = await this.jwtService.verifyAsync<TokenPayload>(
      accessToken,
      { secret: process.env.JWT_SECRET },
    );

    await this.usersService.update(payload.sub, { refreshToken: undefined });
  }

  async refreshTokens(refreshToken: string, res: Response) {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(
        refreshToken,
        { secret: process.env.JWT_SECRET },
      );

      const user = await this.usersService.findOne(payload.sub);
      if (!user || !user.refreshToken) {
        throw new ForbiddenException('Access Denied');
      }

      const tokens = await this.getTokens(user);
      await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

      return { data: { user: user._id, ...tokens } };
    } catch {
      clearAuthCookies(res);
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  async getMe(accessToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(
        accessToken,
        { secret: process.env.JWT_SECRET },
      );

      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(user: User & { _id: Types.ObjectId }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: user._id, email: user.email },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        { sub: user._id, email: user.email },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
