import type { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';
import { configureRequest } from './config';
import responseHandle from './responseHandle';
import type { BackendErrorStatus, RequestConfig } from './types';

const axiosInstance = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'content-type': 'application/json'
  }
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    const method = config?.method?.toLocaleLowerCase();

    switch (method) {
      // 这些方法通常在请求体中携带数据
      case 'post':
      case 'put':
      case 'patch':
        // 参数统一处理，请求都使用data传参
        Object.assign(config, { ...config.data });
        break;

      // 这些方法通常在URL参数中携带数据
      case 'get':
      case 'delete':
      case 'head':
      case 'options':
        // 参数统一处理
        config.params = config.data;
        break;

      default:
        throw new Error(`不允许的请求方法：${config.method}`);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  async (response: AxiosResponse) => {
    const { config, status }: { config: RequestConfig; status: number } = response;

    // 自定义配置 disableInterceptResponse 则不拦截
    if (config.disableInterceptResponse) {
      return response;
    }

    // 如果状态码不是 2xx，抛出错误让错误处理器处理
    if (status < 200 || status >= 300) {
      throw response;
    }

    // 使用通用的成功响应处理
    if (responseHandle.success) {
      return await responseHandle.success(response);
    }

    // 如果没有任何处理函数，直接返回响应数据
    return response.data;
  },
  async (error) => {
    // 非2xx的状态码会走这里
    const { status }: { status: BackendErrorStatus } = error.response;

    // 尝试使用 responseHandle 处理错误状态码
    // 如果是已定义的状态码，使用对应的处理函数
    if (responseHandle[status]) {
      return await responseHandle[status](error.response);
    }

    // 使用默认的错误处理
    if (responseHandle.errorDefault) {
      await responseHandle.errorDefault(error.response);
    }

    // 如果没有任何处理函数处理，则直接抛出原始错误
    throw error;
  }
);

export { axiosInstance, configureRequest };
