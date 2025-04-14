import { Request } from 'express';

export const cookieConfig = {
  refreshToken: {
    name: 'refreshToken',
    options: {
      path: '/', // For production, use '/auth/api/refresh-tokens'. We use '/' for localhost in order to work on Chrome.
      httpOnly: true,
      sameSite: 'strict' as const,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days; must match Refresh JWT expiration.
    },
  },
};

export const extractRefreshTokenFromCookies = (req: Request) => {
  const cookies = req.headers.cookie?.split('; ');
  console.log(
    '\n\n ---> apps/server/lib/cookies.util.ts:17 -> cookies: ',
    cookies,
  );
  if (!cookies?.length) {
    return null;
  }

  // const refreshTokenCookie = cookies.find((cookie) =>
  //   cookie.startsWith(`${cookieConfig.refreshToken.name}=`),
  // );

  // if (!refreshTokenCookie) {
  //   return null;
  // }

  return cookies[0].split('=')[1];
};
