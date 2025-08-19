import { Modal } from 'antd';
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { login } from '../domain';
import { configureRequest, getMessageApi } from './config';
import responseHandle from './responseHandle';

// 判断当前环境是否是本地
const IS_LOCAL = ['localhost', '127.0.0.1'].includes(location.hostname);

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '',
  timeout: 5000,
  headers: {
    'content-type': 'application/json'
  }
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (
      config?.method?.toLocaleLowerCase() === 'post' ||
      config?.method?.toLocaleLowerCase() === 'put'
    ) {
      // 参数统一处理，请求都使用data传参
      Object.assign(config, { ...config.data });
    } else if (
      config?.method?.toLocaleLowerCase() === 'get' ||
      config?.method?.toLocaleLowerCase() === 'delete'
    ) {
      // 参数统一处理
      config.params = config.data;
      console.log(
        '%c [ config.params ]-40',
        'font-size:13px; background:pink; color:#bf2c9f;',
        config
      );
    } else {
      return Promise.reject(new Error(`不允许的请求方法：${config.method}`));
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config;
    // 2xx的状态码走这里
    // 不拦截
    if ((config as any).disableInterceptResponse) {
      return response;
    }

    if (!response.data || response.data.code !== 0) {
      const msg = response.data.statusInfo || response.data.msg || response.data.message;
      getMessageApi()?.open({
        type: 'error',
        content: msg || '请求失败'
      });
      return Promise.reject(response.data);
    }

    return response;
  },
  (error) => {
    // 非2xx的状态码会走这里

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
        getMessageApi()?.open({
          type: 'error',
          content: '登录超时'
        });
      }
      return Promise.reject(error);
    }

    try {
      // node的oapi会把后端信息套一层errorData，egg又会自动把errorData转成JSON字符串，此处进行解析
      const data = JSON.parse(error.response.data.errorData);
      const msg = data.statusInfo || data.msg || data.message;
      getMessageApi()?.open({
        type: 'error',
        content: `${error.response.config.url}请求错误，状态码：${status}，错误信息：${msg}`
      });
    } catch {
      getMessageApi()?.open({
        type: 'error',
        content: `${error.response.config.url}请求错误，状态码：${status}`
      });
    }

    return Promise.reject(error);
  }
);

export { axiosInstance, responseHandle, configureRequest };
