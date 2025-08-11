import type { Context } from 'koa';

export const createCookieOptions = (ctx: Context) => ({
  httpOnly: true,
  secure: ctx.secure,
  maxAge: 24 * 60 * 60 * 1000, // 24小时
  sameSite: 'lax' as const,
  domain: process.env.NODE_ENV === 'production' ? '.myWebsite.com' : undefined,
  path: '/'
});
