import fs from 'node:fs/promises';
import path from 'node:path';
import { PortManager } from '@b-admin-platform/build-utils';
import type { Context, Next } from 'koa';
import type { NotFoundMiddlewareOptions } from '@/types';
import { appsPath } from '@/utils/path';

/**
 * 404 Not Found 中间件
 * @description 处理未匹配到路由的请求，返回对应前端应用的 index.html 交给前端路由处理
 */
export function notFoundMiddleware(_options: NotFoundMiddlewareOptions = {}) {
  return async (ctx: Context, next: Next) => {
    const requestPath = ctx.path;
    // 获取所有前端应用名称
    const portManager = PortManager.getInstance({ printLog: false });
    const allApps = portManager.getAllApps();

    // 检查请求路径是否属于某个前端应用
    const targetApp = allApps.find(
      (appName) => requestPath.startsWith(`/${appName}/`) || requestPath === `/${appName}`
    );
    // 如果是前端应用路径且没有找到静态文件，返回应用的 index.html
    if (targetApp && ctx.status === 404) {
      // 设置不缓存
      ctx.type = 'html';
      // 读取对应前端应用的 index.html
      const indexPath = path.join(appsPath, targetApp, 'index.html');
      ctx.body = await fs.readFile(indexPath, 'utf-8');
    } else {
      await next();
    }
  };
}
