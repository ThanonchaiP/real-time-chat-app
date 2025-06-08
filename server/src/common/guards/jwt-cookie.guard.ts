import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtCookieAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext): Request {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    const token = request.cookies['access_token'];

    if (!token) {
      throw new UnauthorizedException('Access token missing in cookies');
    }

    // ใส่ token ลงใน header เพื่อให้ passport-jwt ใช้งานต่อได้
    request.headers.authorization = `Bearer ${token}`;

    return request;
  }
}
