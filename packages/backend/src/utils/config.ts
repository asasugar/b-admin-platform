import type { Context } from 'koa';

let configCache: any = null;

export const getConfig = async () => {
  if (!configCache) {
    configCache = (await import('../../../../config/server/local')).default();
  }
  return configCache;
};

export const getCookieKey = async () => {
  const config = await getConfig();
  return config.adminCookieKey;
};

export const createCookieOptions = (ctx: Context) => ({
  httpOnly: true,
  secure: ctx.secure,
  maxAge: 24 * 60 * 60 * 1000, // 24小时
  sameSite: 'lax' as const,
  domain: process.env.NODE_ENV === 'production' ? '.myWebsite.com' : undefined,
  path: '/'
});
