import type { BackendResult, BackendStatus, Method } from '@b-admin-platform/utils';
import { axiosInstance, responseHandle } from '@b-admin-platform/utils';
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
export default function inject<
  R,
  D extends Record<string, any> = Record<string, any>,
  O extends AxiosRequestConfig<any> | undefined = undefined
>(url: string, method: Method = 'post') {
  return async (data?: D, options?: O): Promise<BackendResult<R | null>> => {
    const response = await axiosInstance[method](url, { data, ...options } as Partial<
      D & InternalAxiosRequestConfig
    >);
    const status = response.status as BackendStatus;
    return responseHandle[status]?.(response) || Promise.reject(response.data);
  };
}
