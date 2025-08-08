import fs from 'node:fs';
import path from 'node:path';
import pkg from '../../../../../package.json';
import { DEFAULT_LOGGER_CONFIG, LOG_CONFIG } from './config';
import { formatDate, getCurrentDate, getDaysDiff } from './dateUtils';
import type { LogColors, LoggerConfig, LoggerProxyInfo, LogLevel, LogType } from './types';

// 命令行日志类
export class CmdLogger {
  private static instance: CmdLogger;
  private colors: LogColors;
  private config: LoggerConfig;

  private constructor(config: Partial<LoggerConfig> = {}) {
    this.colors = LOG_CONFIG.colors;
    this.config = { ...DEFAULT_LOGGER_CONFIG, ...config };
  }

  public static getInstance(config?: Partial<LoggerConfig>): CmdLogger {
    if (!CmdLogger.instance) {
      CmdLogger.instance = new CmdLogger(config);
    }
    return CmdLogger.instance;
  }

  private getPrefix(level: LogLevel): string {
    const timestamp = formatDate();
    return `[${timestamp}] [${level.toUpperCase()}]`;
  }

  private formatMessage(message: any): string {
    if (typeof message === 'string') {
      return message;
    }
    return JSON.stringify(message, null, 2);
  }

  private formatProxyInfo(info: LoggerProxyInfo): void {
    console.group(this.colors.cyan('代理信息:'));
    console.log(this.colors.dim('目标地址:'), info.proxyUrl);
    console.log(this.colors.dim('请求方法:'), info.method);
    console.log(this.colors.dim('请求路径:'), info.path);

    if (info.requestHeaders) {
      const headers = this.config.allowedHeaders?.length
        ? Object.fromEntries(
            Object.entries(info.requestHeaders).filter(([key]) =>
              this.config.allowedHeaders?.includes(key.toLowerCase())
            )
          )
        : info.requestHeaders;

      if (Object.keys(headers).length) {
        console.group(this.colors.dim('请求头:'));
        Object.entries(headers).forEach(([key, value]) => {
          console.log(this.colors.dim(`${key}:`), value);
        });
        console.groupEnd();
      }
    }

    if (info.requestBody) {
      console.group(this.colors.dim('请求体:'));
      console.dir(info.requestBody, { depth: null, colors: true });
      console.groupEnd();
    }

    if (info.responseStatus) {
      console.log(this.colors.dim('响应状态:'), info.responseStatus);
    }

    if (info.responseHeaders) {
      console.group(this.colors.dim('响应头:'));
      Object.entries(info.responseHeaders).forEach(([key, value]) => {
        console.log(this.colors.dim(`${key}:`), value);
      });
      console.groupEnd();
    }

    if (info.responseBody) {
      console.group(this.colors.dim('响应体:'));
      console.dir(info.responseBody, { depth: null, colors: true });
      console.groupEnd();
    }

    console.groupEnd();
  }

  public group(label?: string): void {
    console.group(label);
  }

  public groupEnd(): void {
    console.groupEnd();
  }

  public log(level: LogLevel, message: any): void {
    const prefix = this.getPrefix(level);
    const color = this.colors[level] || this.colors.info;
    const formattedMessage = this.formatMessage(message);

    console.log(color(`${prefix} ${formattedMessage}`));
  }

  public info(message: any): void {
    this.log('info', message);
  }

  public debug(message: any): void {
    this.log('debug', message);
  }

  public error(message: any): void {
    this.log('error', message);
  }

  public warn(message: any): void {
    this.log('warn', message);
  }

  public proxy(info: LoggerProxyInfo): void {
    const prefix = this.getPrefix('info');
    console.log(this.colors.magenta(`${prefix} 代理请求`));
    this.formatProxyInfo(info);
  }
}

// 生成文件日志类
export class FileLogger {
  private static instance: FileLogger;
  private config: LoggerConfig;
  private logDir: string;
  private logPaths!: Record<LogType, string>;

  private constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_LOGGER_CONFIG, ...config };
    this.logDir = path.resolve(process.cwd(), this.config.dir);
    this.initializeLogDir();
    this.initializeLogPaths();
  }

  public static getInstance(config?: Partial<LoggerConfig>): FileLogger {
    if (!FileLogger.instance) {
      FileLogger.instance = new FileLogger(config);
    }
    return FileLogger.instance;
  }

  private initializeLogDir(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private initializeLogPaths(): void {
    const date = getCurrentDate();
    const getLogPath = (type: LogType) => {
      return path.join(this.logDir, `${LOG_CONFIG.files[type]}.${date}.log`);
    };

    this.logPaths = {
      error: getLogPath('error'),
      web: getLogPath('web'),
      agent: getLogPath('agent'),
      schedule: getLogPath('schedule'),
      proxy: getLogPath('proxy')
    };
  }

  private getLogPrefix(level: LogLevel): string {
    const timestamp = formatDate();
    return `[${timestamp}] [${level.toUpperCase()}] `;
  }

  private formatObject(
    obj: any,
    replacer?: (number | string)[] | null,
    space?: string | number
  ): string {
    return JSON.stringify(obj, replacer, space);
  }

  private async writeToFile(type: LogType, message: string): Promise<void> {
    const logPath = this.logPaths[type];
    const logMessage = `${message}\n`;

    try {
      await fs.promises.appendFile(logPath, logMessage);
    } catch (error) {
      console.error(`Failed to write to log file: ${logPath}`, error);
    }
  }

  private async cleanOldLogs(): Promise<void> {
    try {
      const files = await fs.promises.readdir(this.logDir);

      for (const file of files) {
        const filePath = path.join(this.logDir, file);
        const stats = await fs.promises.stat(filePath);
        const daysDiff = getDaysDiff(stats.mtime);

        if (daysDiff > this.config.maxDays!) {
          await fs.promises.unlink(filePath);
          console.log(`Deleted old log file: ${file}`);
        }
      }
    } catch (error) {
      console.error('Failed to clean old logs:', error);
    }
  }

  public error(message: string | Error): void {
    const errorMessage = message instanceof Error ? message.stack || message.message : message;
    const logMessage = this.getLogPrefix('error') + errorMessage;
    this.writeToFile('error', logMessage);
  }

  public web(message: string): void {
    const logMessage = this.getLogPrefix('info') + message;
    this.writeToFile('web', logMessage);
  }

  public agent(message: string): void {
    const logMessage = this.getLogPrefix('info') + message;
    this.writeToFile('agent', logMessage);
  }

  public schedule(message: string): void {
    const logMessage = this.getLogPrefix('info') + message;
    this.writeToFile('schedule', logMessage);
  }

  public proxy(info: LoggerProxyInfo): void {
    const logMessage =
      this.getLogPrefix('info') +
      this.formatObject({
        proxyUrl: info.proxyUrl,
        method: info.method,
        path: info.path,
        requestHeaders: info.requestHeaders,
        requestBody: info.requestBody,
        responseStatus: info.responseStatus,
        responseHeaders: info.responseHeaders,
        responseBody: info.responseBody
      });
    this.writeToFile('proxy', logMessage);
  }

  public startCleanup(intervalHours = 24): void {
    setInterval(
      () => {
        this.cleanOldLogs();
      },
      intervalHours * 60 * 60 * 1000
    );
  }
}

// 导出单例实例
export const cmdLogger = CmdLogger.getInstance({
  allowedHeaders: ['host', 'content-type', 'x-traffic-group', 'cookie'] // 不区分大小写
});
export const fileLogger = FileLogger.getInstance({
  dir: `../../../logs/${pkg.name}`
});
