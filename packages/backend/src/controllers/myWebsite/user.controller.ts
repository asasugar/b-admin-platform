import type { RouterContext } from '@koa/router';
import Router from '@koa/router';
import jwt from 'jsonwebtoken';
import { BError } from '@/utils/error';
import { userService } from '../../services/myWebsite/user.service';
import type { UserLoginDTO } from '../../types/myWebsite/user';

const JWT_SECRET = 'your-jwt-secret-key'; // 应该与 service 中的值保持一致

// 获取当前环境的配置
const getConfig = async () => {
  const config = (await import('../../../../../config/server/local')).default();
  return config;
};

const router = new Router({
  prefix: '/api/myWebsite/user'
});

// 登录接口
router.post('/login', async (ctx: RouterContext) => {
  try {
    const loginDto: UserLoginDTO = ctx.request.body;
    const result = await userService.login(loginDto);
    const config = await getConfig();

    // 设置认证cookie
    ctx.cookies.set(config.adminCookieKey, result.token, {
      httpOnly: true,
      secure: ctx.secure,
      maxAge: 24 * 60 * 60 * 1000, // 24小时
      sameSite: 'lax'
    });

    ctx.body = {
      code: 0,
      data: result,
      message: '登录成功'
    };
  } catch (error) {
    if (error instanceof BError) {
      ctx.status = error.code;
      ctx.helper.error({
        message: error.message,
        code: error.code
      });
    } else {
      ctx.helper.error({
        message: error instanceof Error ? error.message : '登录失败',
        code: 401
      });
    }
  }
});

// 获取用户信息接口
router.get('/info', async (ctx: RouterContext) => {
  try {
    const config = await getConfig();
    const token = ctx.cookies.get(config.adminCookieKey);
    if (!token) {
      ctx.helper.error({
        message: '未登录或登录已过期',
        code: 401
      });
      return;
    }

    let userId: number;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      userId = decoded.id;
    } catch {
      ctx.helper.error({
        message: '无效的认证信息',
        code: 401
      });
      return;
    }

    const userInfo = await userService.getUserInfo({ userId });
    ctx.body = {
      code: 0,
      data: userInfo,
      message: '获取用户信息成功'
    };
  } catch (error) {
    if (error instanceof BError) {
      ctx.status = error.code;
      ctx.helper.error({
        message: error.message,
        code: error.code
      });
    } else {
      ctx.helper.error({
        message: error instanceof Error ? error.message : '获取用户信息失败',
        code: 401
      });
    }
  }
});

export const myWebsiteUserController = router;
