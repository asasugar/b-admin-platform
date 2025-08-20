import type { CustomAxiosResponse, Method, RequestConfig } from '@b-admin-platform/utils';
import { axiosInstance } from '@b-admin-platform/utils';

/**
 * api接口inject
 * @param url {string} 请求接口链接
 * @param method {Method} 请求方式:默认 post
 */
export default function inject<
  T = any,
  D extends Record<string, any> = Record<string, any>,
  K extends RequestConfig = RequestConfig
>(url: string, method: Method = 'post') {
  return async (data?: D, options?: K): Promise<CustomAxiosResponse<T | null>> => {
    return axiosInstance[method](url, { data, ...options });
  };
}
