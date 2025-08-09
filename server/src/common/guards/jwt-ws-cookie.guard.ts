import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { parseCookies } from '@/utils';

@Injectable()
export class JwtWsCookieGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient<Socket>();

    // ลองอ่าน token จาก auth object ก่อน
    let token = client.handshake.auth.token;

    // ถ้าไม่มี ลองอ่านจาก cookies
    if (!token && client.handshake.headers.cookie) {
      const cookies = parseCookies(client.handshake.headers.cookie);
      token = cookies.access_token;
    }

    console.log('Token from cookies:', token);
    if (!token) {
      throw new WsException('Unauthorized');
    }

    try {
      const payload = this.jwtService.verify(token);
      client.handshake.auth.userId = payload.sub;
      return true;
    } catch {
      throw new WsException('Invalid token');
    }
  }
}
