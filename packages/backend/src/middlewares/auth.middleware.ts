import type { Context, Next } from 'koa';
import type { AdminAuthOptions, MockLoginConfig } from '@/types';

/**
 * 执行模拟登录
 * @param ctx - Koa上下文
 * @returns Promise<string> - 返回cookieId
 * @throws {Error} 登录失败时抛出错误
 */
async function startMockLogin(ctx: Context, config: AdminAuthOptions): Promise<string> {
  try {
    const { mockUrl, mockData } = config.mockLogin as MockLoginConfig;
    if (!mockUrl) {
      throw new Error('模拟登录失败: 未配置mockUrl');
    }
    console.log('开始模拟登录:', { url: mockUrl, data: mockData });

    // 发送模拟登录请求
    const formData = new URLSearchParams();
    if (mockData) {
      Object.entries(mockData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const response = await fetch(mockUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      body: formData
    });

    // 获取并验证cookie
    const cookies = response.headers.get('set-cookie');

    if (!cookies?.length) {
      throw new Error('模拟登录失败: 服务器未返回cookie');
    }

    // 解析cookie
    const cookiesMap = ctx.helper.parseCookie(cookies);
    const cookieId = cookiesMap[config.adminCookieKey];

    if (!cookieId) {
      throw new Error(`模拟登录失败: 未找到cookie ${config.adminCookieKey}`);
    }

    // 设置cookie
    ctx.cookies.set(config.adminCookieKey, cookieId, {
      httpOnly: true,
      secure: ctx.secure,
      maxAge: 24 * 60 * 60 * 1000, // 24小时
      sameSite: 'lax' as const,
      path: '/'
    });

    console.log('模拟登录成功:', { cookieId });
    return cookieId;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('模拟登录失败:', errorMessage);
    throw new Error(`模拟登录失败: ${errorMessage}`);
  }
}
// Auth 中间件
export async function authMiddleware(options?: AdminAuthOptions) {
  const _config = (await import('../../../../config/server/local')).default();
  const { adminCookieKey, adminCookieValue, mockLogin } = _config;
  // 默认配置
  const defaultOptions: AdminAuthOptions = {
    adminCookieKey,
    adminCookieValue,
    loginUrl: '公共登录页面地址', // 公共登录页面
    mockLogin
  };

  // 合并配置
  const config = {
    ...defaultOptions,
    ...options
  };
  /**
   * 中间件主函数
   * 处理认证逻辑，包括cookie验证、模拟登录和重定向
   */
  return async (ctx: Context, next: Next) => {
    try {
      // 跳过登录接口的认证
      if (ctx.path === '/myWebsite/user/login') {
        return await next();
      }

      // 获取cookie中的cookieId
      let cookieId = ctx.cookies.get(config.adminCookieKey);
      if (config.adminCookieValue) {
        // 处理固定cookie值模式
        if (cookieId !== config.adminCookieValue) {
          return ctx.helper.error({
            message: '未登录或登录已过期',
            code: 302
          });
        }
      } else if (!cookieId && config.mockLogin?.enabled) {
        // 处理无cookie情况
        try {
          cookieId = await startMockLogin(ctx, config as AdminAuthOptions);
          if (!cookieId) {
            return ctx.helper.error({
              message: '模拟登录失败',
              code: 302
            });
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          return ctx.helper.error({
            message: errorMessage,
            code: 302
          });
        }
      }

      if (!cookieId) {
        // 最终的登录检查
        return ctx.helper.error({
          message: '未登录',
          code: 302
        });
      }

      // 更新cookie并继续处理请求
      ctx.cookies.set(config.adminCookieKey, cookieId, {
        httpOnly: true,
        secure: ctx.secure,
        maxAge: 24 * 60 * 60 * 1000, // 24小时
        sameSite: 'lax' as const,
        path: '/'
      });
      await next();
    } catch (error) {
      return ctx.helper.error({
        message: 'Koa 登录授权中间件服务器内部错误',
        code: 500,
        error: error as Error
      });
    }
  };
}
