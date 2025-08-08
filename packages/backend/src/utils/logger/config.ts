import chalk from 'chalk';
import type { LogColors, LoggerConfig } from './types';

// 默认日志配置
export const DEFAULT_LOGGER_CONFIG: LoggerConfig = {
  dir: 'logs',
  level: 'info',
  maxFiles: 30,
  maxDays: 30
};

// 日志配置
export const LOG_CONFIG = {
  colors: {
    info: chalk.green,
    debug: chalk.blue,
    error: chalk.red,
    warn: chalk.yellow,
    dim: chalk.dim,
    cyan: chalk.cyan,
    magenta: chalk.magenta,
    gray: chalk.gray
  } satisfies LogColors,
  files: {
    proxy: 'proxy',
    error: 'error',
    web: 'web',
    agent: 'agent',
    schedule: 'schedule',
    app: '{appName}-web' // 应用日志文件名模板，{appName}会被替换为实际的应用名称
  }
};
