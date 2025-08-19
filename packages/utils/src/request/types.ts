import type { MessageInstance } from 'antd/es/message/interface';
import type { AxiosResponse } from 'axios';

export type Method = 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch';

export type BackendStatus = 200 | 201 | 301 | 302 | 400 | 404 | 405 | 500;

export interface BackendResult<T = null> {
  data: T;
  code?: 0 | 1;
  message?: string;
}

export type BackendResponseHandle = Record<
  BackendStatus,
  (response: AxiosResponse) => Promise<BackendResult>
>;

export interface RequestConfig {
  messageApi?: MessageInstance;
}
