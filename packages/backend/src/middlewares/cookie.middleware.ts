import jwt from 'jsonwebtoken';
import type { Context, Next } from 'koa';
import { createCookieOptions, getCookieKey } from '../utils/config';

const JWT_SECRET = 'your-jwt-secret-key'; // 应该与 user.service 中的值保持一致

const COOKIE_RENEW_BEFORE = 2 * 60 * 60 * 1000; // 2小时内过期的cookie将被续期

export async function cookieMiddleware() {
  return async (ctx: Context, next: Next) => {
    // 跳过登录接口
    if (ctx.path === '/myWebsite/user/login') {
      return await next();
    }

    await next();

    // 在请求完成后检查是否需要续期
    const cookieKey = await getCookieKey();
    const token = ctx.cookies.get(cookieKey);

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { exp?: number };
        if (decoded.exp) {
          const now = Math.floor(Date.now() / 1000);
          const timeToExpire = decoded.exp - now;

          // 如果token还有2小时就过期，则续期
          if (timeToExpire > 0 && timeToExpire < COOKIE_RENEW_BEFORE / 1000) {
            const cookieOptions = createCookieOptions(ctx);
            ctx.cookies.set(cookieKey, token, cookieOptions);
            console.log('Cookie renewed:', { cookieKey, timeToExpire: `${Math.floor(timeToExpire / 3600)}h` });
          }
        }
      } catch (_error) {
        // token 无效，不进行续期
        console.warn('Invalid token, skipping renewal');
      }
    }
  };
}
