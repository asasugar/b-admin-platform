/**
 * 模拟登录数据结构
 */
export interface MockLoginData {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 令牌（可选） */
  token?: string;
}

/**
 * 模拟登录配置
 */
export interface MockLoginConfig {
  /** 是否启用模拟登录 */
  enabled: boolean;
  /** 模拟登录接口地址 */
  mockUrl: string;
  /** 模拟登录数据 */
  mockData?: MockLoginData;
}

/**
 * Admin Auth 中间件配置选项
 */
export interface AdminAuthOptions {
  /** Cookie键名，用于存储会话ID */
  adminCookieKey: string;
  /** 固定的Cookie值，如果设置则只接受该值 */
  adminCookieValue?: string;
  /** 环境标识，用于区分不同环境 */
  env?: string;
  /** 登录页面URL，用户未登录时跳转到此页面 */
  loginUrl?: string;
  /** 模拟登录配置 */
  mockLogin?: MockLoginConfig;
}
