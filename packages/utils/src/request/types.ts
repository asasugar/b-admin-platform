import type { MessageInstance } from 'antd/es/message/interface';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * 请求方法
 */
export type Method = 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch';

/**
 * 后端接口自定义错误状态码【302、401、403】
 */
export type BackendErrorStatus = 302 | 401 | 403;

/**
 * 后端接口返回结果
 */
export interface BackendResult<T = null> {
  data: T;
  code?: 0 | 1;
  message?: string;
}

/**
 * 后端接口返回结果处理【成功、默认失败、自定义失败】
 */
export interface BackendResponseHandle
  extends Record<BackendErrorStatus, (response: AxiosResponse) => Promise<BackendResult>> {
  errorDefault?: (response: AxiosResponse) => Promise<BackendResult>;
  success?: (response: AxiosResponse) => Promise<BackendResult>;
}

/**
 * 自定义请求配置【是否禁用拦截、消息提示】
 */
export interface RequestConfig extends Partial<InternalAxiosRequestConfig> {
  disableInterceptResponse?: boolean;
  messageApi?: MessageInstance;
}

/**
 * 自定义请求响应
 */
export type CustomAxiosResponse<T = any> = BackendResult<T> | AxiosResponse;

/**
 * 扩展 axios 模块定义
 */
declare module 'axios' {
  interface AxiosInstance {
    (config: AxiosRequestConfig): CustomAxiosResponse;
  }
}
