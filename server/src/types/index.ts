export interface TokenPayload {
  sub: string; // user id
  email: string;
  iat?: number; // issued at
  exp?: number; // expired at
}
