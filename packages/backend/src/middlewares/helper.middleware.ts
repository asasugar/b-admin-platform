import type { Context, Next } from 'koa';
import type { ErrorInfo } from '@/types';

/**
 * Helper 类
 * @class
 * @description 提供一些通用的辅助方法
 */
class Helper {
  ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  /**
   * 解析cookie字符串为对象
   * @description 将cookie字符串解析为键值对对象，支持处理多个cookie
   * @param {string} cookieStr - 要解析的cookie字符串
   * @returns {Record<string, string>} 解析后的cookie对象
   * @example
   * // 返回 { userId: "123", sessionId: "abc" }
   * parseCookie("userId=123; sessionId=abc");
   *
   * // 返回 { name: "test" }
   * parseCookie("name=test");
   *
   * // 返回 {}
   * parseCookie("");
   */
  parseCookie(cookieStr: string): Record<string, string> {
    // 如果输入为空，返回空对象
    if (!cookieStr || typeof cookieStr !== 'string') {
      return {};
    }

    const cookies: Record<string, string> = {};

    // 使用更精确的正则表达式，处理等号和分号在值中的情况
    const cookiePairs = cookieStr.split(/;\s*/);

    for (const pair of cookiePairs) {
      // 查找第一个等号的位置
      const firstEqualIndex = pair.indexOf('=');
      if (firstEqualIndex > 0) {
        const name = pair.slice(0, firstEqualIndex).trim();
        const value = pair.slice(firstEqualIndex + 1).trim();

        // 只存储非空的值
        if (name && value) {
          try {
            // 解码URI编码的值
            cookies[name] = decodeURIComponent(value);
          } catch {
            // 如果解码失败，使用原始值
            cookies[name] = value;
          }
        }
      }
    }
    return cookies;
  }

  // 生成请求ID
  generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  /**
   * 返回成功响应
   * @param {any} data - 响应数据
   */
  // success(data: any = null) {
  //   this.ctx.body = {
  //     code: 200,
  //     success: true,
  //     data
  //   };
  // }

  /**
   * 处理错误响应
   * @param {string} message - 错误信息
   * @param {number} code - 错误码
   * @param {Error} error - 错误对象
   * @param {Record<string, any>} other - 其他参数
   */
  error({ message, code = 400, error, other }: ErrorInfo) {
    this.ctx.status = code;
    if (error) {
      const _errorMessage = error instanceof Error ? error.message : String(error);
      const _errorStack = error instanceof Error ? error.stack : undefined;
      error = {
        message: _errorMessage,
        stack: _errorStack
      };
    }
    this.ctx.body = {
      code,
      success: false,
      message,
      error,
      ...other
    };
  }
}

/**
 * Helper 中间件
 * @returns {Koa.Middleware} Koa中间件函数
 */
export function helperMiddleware() {
  return async (ctx: Context, next: Next) => {
    ctx.helper = new Helper(ctx);
    await next();
  };
}
