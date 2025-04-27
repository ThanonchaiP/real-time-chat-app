import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { Model, Types } from 'mongoose';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import { SignInDto } from './dto/sign-in.dto';

interface TokenPayload {
  sub: string; // user id
  email: string;
  iat?: number; // issued at
  exp?: number; // expired at
}

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

  async logout(userId: string) {
    await this.usersService.update(userId, { refreshToken: undefined });
  }

  async refreshTokens(refreshToken: string) {
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
      throw new UnauthorizedException('Invalid refresh token');
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
          expiresIn: '1d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
