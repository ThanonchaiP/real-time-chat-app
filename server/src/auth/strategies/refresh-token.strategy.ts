import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenPayload } from 'src/types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET ?? 'secret',
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: TokenPayload) {
    const refreshToken = (req.get('Authorization') ?? '')
      .replace('Bearer', '')
      .trim();

    return { ...payload, refreshToken };
  }
}
