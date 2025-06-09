import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  getRequest(context: ExecutionContext): Request {
    const request = context.switchToHttp().getRequest<Request>();
    const refreshToken = request.cookies?.['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    // ใส่ token เข้า header เพื่อให้ strategy ใช้ (บางกรณี)
    request.headers.authorization = `Bearer ${refreshToken}`;

    return request;
  }
}
