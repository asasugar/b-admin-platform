import type { ChalkInstance } from 'chalk';

// 日志类型定义
export type LogType = 'error' | 'web' | 'agent' | 'schedule' | 'proxy';

// 日志级别定义
export type LogLevel = 'info' | 'debug' | 'error' | 'warn';

// 代理信息接口
export interface LoggerProxyInfo {
  proxyUrl: string;
  method: string;
  path: string;
  requestHeaders?: Record<string, string>;
  requestBody?: any;
  responseStatus?: number;
  responseHeaders?: Record<string, string>;
  responseBody?: any;
}

// 日志配置接口
export interface LoggerConfig {
  dir: string; // 日志根目录
  level?: LogLevel; // 日志级别
  maxFiles?: number; // 每个类型日志保留的最大文件数
  maxDays?: number; // 日志保留天数
  allowedHeaders?: string[]; // 允许记录的请求头列表，如果为空则记录所有请求头
}

// 颜色配置类型
export type LogColors = {
  info: ChalkInstance;
  debug: ChalkInstance;
  error: ChalkInstance;
  warn: ChalkInstance;
  dim: ChalkInstance;
  cyan: ChalkInstance;
  magenta: ChalkInstance;
  gray: ChalkInstance;
};
