export interface Helper {
  parseCookie(cookieStr: string): Record<string, string>;
  generateRequestId(): string;
  // success(data?: any): void;
  error(errorInfo: ErrorInfo): void;
}

declare module 'koa' {
  interface Context {
    helper: Helper;
  }
}

export interface ErrorInfo {
  message: string;
  code?: number;
  error?:
    | {
        message: Error['message'];
        stack: Error['stack'];
      }
    | Error;
  other?: Record<string, any>;
}
