import { Modal, message } from 'antd';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

import { login } from '../domain';

// 判断当前环境是否是本地
const IS_LOCAL = ['localhost', '127.0.0.1'].includes(location.hostname);

// axios发送的请求，如果请求本身为空，则会改将content-type转为application/x-www-form-urlencoded，需要手动设置默认值避免出现自动转的情况
axios.defaults.headers['Content-Type'] = 'application/json; charset=utf-8';

const http = axios.create();

// http请求附加 region 参数

// 返回拦截
http.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config;

    // 2xx的状态码走这里
    // 不拦截
    if ((config as any).disableInterceptResponse) {
      return response;
    }

    if (!response.data || response.data.code !== 0) {
      const msg = response.data.statusInfo || response.data.msg || response.data.message;
      message.error(msg || '请求失败');
      return Promise.reject(response.data);
    }

    return response.data;
  },
  (error) => {
    // 非2xx的状态码会走这里
    console.log('%c [ error ]-39', 'font-size:13px; background:pink; color:#bf2c9f;', error.response)

    const { status } = error.response;
    const notLogin302 = status === 302 && error.response.data === '未登录';

    if (status === 401 || status === 403 || notLogin302) {
      // 本地开发环境不做验证
      if (!IS_LOCAL) {
        Modal.warning({
          title: '提示',
          content: '检测到您无权限或当前登录已过期，是否跳转重新登录？',
          okText: '去登录',
          cancelText: '取消',
          onOk() {
            location.href = login();
          }
        });
      } else {
        message.error('登录超时');
      }
      return Promise.reject(error);
    }

    try {
      // node的oapi会把后端信息套一层errorData，egg又会自动把errorData转成JSON字符串，此处进行解析
      const data = JSON.parse(error.response.data.errorData);
      const msg = data.statusInfo || data.msg || data.message;
      message.error(`${error.response.config.url}请求错误，状态码：${status}，错误信息：${msg}`);
    } catch {
      message.error(`${error.response.config.url}请求错误，状态码：${status}`);
    }

    return Promise.reject(error);
  }
);

/**
 *
 * @param {string} baseURL 基础路径
 * @returns
 */
export const createGet =
  <T = any>(baseURL: string) =>
  (url: string, options?: AxiosRequestConfig) =>
  (params?: object): Promise<ApiResponse<T>> =>
    http.get(url, { params, baseURL, ...options });

export const createPost =
  <T = any>(baseURL: string) =>
  (url: string, options?: AxiosRequestConfig) =>
  (data?: object): Promise<ApiResponse<T>> =>
    http.post(url, data, { baseURL, ...options });

export const createDelete =
  <T = any>(baseURL: string) =>
  (url: string, options?: AxiosRequestConfig) =>
  (params?: object): Promise<ApiResponse<T>> =>
    http.delete(url, { params, baseURL, ...options });

export { http };
