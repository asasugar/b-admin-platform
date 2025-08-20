import type { Context, Next } from 'koa';
import proxy from 'koa-proxies';
import type { ErrorInfo, ProxyInfo } from '@/types';
import { cmdLogger, fileLogger } from '@/utils/logger';
import type { LoggerProxyInfo } from '@/utils/logger/types';
import { extractProxyInfo } from '@/utils/proxy';

/**
 * 创建代理中间件
 */
function createProxy(ctx: Context, proxyInfo: ProxyInfo) {
  const proxyLogInfo: Partial<LoggerProxyInfo> = {
    proxyUrl: proxyInfo.proxyUrl,
    method: ctx.method,
    path: ctx.path,
    requestHeaders: ctx.headers as Record<string, string>,
    requestBody: ctx.request.body
  };

  const isDev = process.env.NODE_ENV === 'development';

  // 获取 adminCookieKey
  const adminCookieKey =
    ctx.config?.adminCookieKey || `myWebsite-intranet-${proxyInfo.localEnv || 'test'}-sid`;

  return proxy('', {
    target: proxyInfo.target,
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/proxy\/([^\/]+)/, ''),
    logs: false,
    events: {
      error: (err, _req, _res) => {
        proxyLogInfo.responseStatus = err.statusCode || 500;

        cmdLogger.proxy(proxyLogInfo as LoggerProxyInfo);
        fileLogger.proxy(proxyLogInfo as LoggerProxyInfo);

        if (ctx) {
          const errorInfo: ErrorInfo = {
            message: err.message || 'Proxy request failed',
            code: err.statusCode || 500,
            other: {
              path: ctx.path,
              timestamp: new Date().toISOString()
            }
          };
          if (isDev) {
            errorInfo.error = err;
          }
          ctx.helper.error(errorInfo);
        }
      },
      proxyReq: (proxyReq, req, _res) => {
        const headers = (req as any).headers || {};

        // 复制重要的请求头
        const headersToForward = [
          'content-type',
          'authorization',
          'user-agent',
          'accept',
          'accept-encoding',
          'accept-language',
          'origin',
          'referer',
          'cookie'
        ];

        headersToForward.forEach((header) => {
          const value = headers[header];
          if (value) {
            proxyReq.setHeader(header, value);
          }
        });

        // 添加 cookieId 到请求头
        const cookieId = ctx.cookies.get(adminCookieKey);
        if (cookieId) {
          proxyReq.setHeader('Cookie', `${adminCookieKey}=${cookieId}`);
        }

        // 禁用压缩，以避免编码问题
        proxyReq.setHeader('accept-encoding', 'identity');

        // 添加请求追踪信息
        const requestId = headers['x-request-id'] || ctx.helper.generateRequestId();
        proxyReq.setHeader('X-Request-ID', requestId);

        if (isDev) {
          // 开发环境添加 x-traffic-group 头，用于泳道流量分组
          proxyReq.setHeader('x-traffic-group', `channel-${proxyInfo.localEnv}`);
        }
        proxyLogInfo.requestHeaders = proxyReq.getHeaders() as Record<string, string>;
      },
      proxyRes: (proxyRes, _req, _res) => {
        proxyLogInfo.responseStatus = proxyRes.statusCode;
        proxyLogInfo.responseHeaders = proxyRes.headers as Record<string, string>;

        proxyRes.headers['x-proxy-response'] = 'true';
        proxyRes.headers['x-proxy-timestamp'] = new Date().toISOString();

        // 获取响应体
        const chunks: Buffer[] = [];
        // 检查响应类型
        const contentType = proxyRes.headers['content-type'] || '';
        const isBinaryContent =
          contentType.includes('application/octet-stream') ||
          contentType.includes('image/') ||
          contentType.includes('video/') ||
          contentType.includes('audio/') ||
          contentType.includes('application/x-download') ||
          contentType.includes('application/pdf');

        proxyRes.on('data', (chunk: Buffer) => {
          if (!isBinaryContent) {
            chunks.push(chunk);
          }
        });

        proxyRes.on('end', () => {
          // 只有非二进制内容才记录响应体
          if (!isBinaryContent) {
            const buffer = Buffer.concat(chunks);
            const responseBody = buffer.toString();
            try {
              proxyLogInfo.responseBody =
                typeof responseBody === 'string' && responseBody.startsWith('{')
                  ? JSON.parse(responseBody)
                  : responseBody;
            } catch (err) {
              console.error('Failed to parse response body:', err);
              // 如果解析失败，返回原始字符串
              proxyLogInfo.responseBody = responseBody;
            }
          } else {
            proxyLogInfo.responseBody = '[Binary Content]';
          }

          cmdLogger.proxy(proxyLogInfo as LoggerProxyInfo);
          fileLogger.proxy(proxyLogInfo as LoggerProxyInfo);
        });
      }
    }
  });
}

export function proxyMiddleware() {
  return async (ctx: Context, next: Next) => {
    try {
      const proxyInfo = await extractProxyInfo(ctx);

      if (proxyInfo) {
        // 创建代理中间件并执行
        const serviceProxy = createProxy(ctx, proxyInfo);
        await serviceProxy(ctx, next);
        return;
      }
      await next();
    } catch (error) {
      console.error('Failed to extract proxy info:', error);
      ctx.helper.error({
        message: 'Failed to extract proxy info',
        code: 500
      });
    }
  };
}
