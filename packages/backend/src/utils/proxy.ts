import type { Context } from 'koa';
import type { ProxyInfo } from '@/types';

/**
 * 从请求路径中提取代理信息
 * @param ctx - Koa 上下文
 * @returns 代理信息，如果不是代理请求则返回 null
 */
export async function extractProxyInfo(ctx: Context): Promise<ProxyInfo | null> {
  if (!ctx.path.startsWith('/api/proxy/')) {
    return null;
  }

  const match = ctx.path.match(/^\/api\/proxy\/([^/]+)/);
  if (!match) {
    return null;
  }

  const apiName = match[1];
  const config = (await import('../../../../config/server/local')).default();
  const target = config.oapis[apiName]?.domain;

  if (!target) {
    return null;
  }

  const proxyPath = ctx.path.replace(/^\/api\/proxy\/[^/]+/, '');

  return {
    localEnv: config.localEnv,
    apiName,
    target,
    originalPath: ctx.path,
    proxyPath,
    proxyUrl: `${target}${proxyPath}`
  };
}
