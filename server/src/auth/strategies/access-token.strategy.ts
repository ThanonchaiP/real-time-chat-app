import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenPayload } from 'src/types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // ดึง token จาก Authorization Header
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret', //
    });
  }

  validate(payload: TokenPayload) {
    // payload คือ decoded token
    return payload; // จะถูกแนบเข้า req.user อัตโนมัติ
  }
}
