import {
  generateBackendIndexHtml,
  generateFrontendIndexHtml,
  PortManager
} from '@b-admin-platform/build-utils';
import type { Context, Next } from 'koa';
import type { NotFoundMiddlewareOptions } from '@/types';
/**
 * 404 Not Found 中间件
 * @description 处理未匹配到路由的请求，返回对应前端应用的 index.html 或 404 错误
 */
export function notFoundMiddleware(_options: NotFoundMiddlewareOptions = {}) {
  // 不再需要 fallbackPath，因为我们动态生成HTML

  return async (ctx: Context, next: Next) => {
    // 设置不缓存
    ctx.set('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
    ctx.set('Pragma', 'no-cache');
    ctx.set('Expires', '0');

    const requestPath = ctx.path;
    await next();

    // 获取所有前端应用名称
    const portManager = PortManager.getInstance({ printLog: false });
    const allApps = portManager.getAllApps();
    // 检查请求路径是否属于某个前端应用
    let targetApp: string | null = null;

    // 匹配应用路径，如 /demo/xxx, /demo1/xxx
    for (const appName of allApps) {
      if (requestPath.startsWith(`/${appName}/`) || requestPath === `/${appName}`) {
        targetApp = appName;
        break;
      }
    }
    try {
      ctx.type = 'html';
      if (targetApp) {
        // 如果是前端应用路径，返回对应应用的 index.html
        ctx.body = await generateFrontendIndexHtml();
      } else if (ctx.status === 404) {
        if (requestPath.startsWith('/api/proxy/')) {
          ctx.helper.error({
            message: 'API route not found',
            code: 404
          });
        } else {
          // 动态生成首页HTML，包含所有应用列表
          ctx.body = await generateBackendIndexHtml(allApps, portManager);
        }
      }
    } catch (error) {
      // 如果文件不存在或读取失败，返回404
      const _error = error instanceof Error ? error : new Error('Unknown error');
      console.error(`❌ 处理请求失败:`, _error.message);

      ctx.helper.error({
        message: 'Page not found',
        code: 404,
        error: _error
      });
    }
  };
}
