import { Response } from 'express';

const isProd = process.env.NODE_ENV === 'production';

const getBaseCookieOptions = () => ({
  httpOnly: true,
  secure: isProd,
  sameSite: 'strict' as const,
});

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  res.cookie('access_token', accessToken, {
    ...getBaseCookieOptions(),
    maxAge: 1000 * 60 * 60, // 1 ชั่วโมง
  });

  res.cookie('refresh_token', refreshToken, {
    ...getBaseCookieOptions(),
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 วัน
  });
};

export const clearAuthCookies = (res: Response) => {
  const options = {
    ...getBaseCookieOptions(),
    maxAge: 0,
  };

  res.clearCookie('access_token', options);
  res.clearCookie('refresh_token', options);
};
