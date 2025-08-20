import { Modal } from 'antd';
import type { AxiosResponse } from 'axios';
import { login } from '../domain';
import { getMessageApi } from './config';
import type {  BackendResponseHandle } from './types';

const IS_LOCAL = ['localhost', '127.0.0.1'].includes(location.hostname);

// 成功的业务状态码
const SUCCESS_CODES = [0, '0', 200, '200', '000'] as const;

// 错误消息常量
const ERROR_MESSAGES = {
  UNAUTHORIZED: '检测到您无权限或当前登录已过期，是否跳转重新登录？',
  LOGIN_TIMEOUT: '登录超时'
} as const;

// 默认的错误处理
const handleDefaultError = async (response: any) => {
  try {
    // 无状态码时候兜底处理，比如网络错误
    if (!response) {
      getMessageApi()?.open({
        type: 'error',
        content: '网络错误，请检查您的网络连接'
      });
      throw response;
    }
    // node的oapi会把后端信息套一层errorData，egg又会自动把errorData转成JSON字符串，此处进行解析
    const data = JSON.parse(response.data.errorData);
    const msg = data.statusInfo || data.msg || data.message;
    getMessageApi()?.open({
      type: 'error',
      content: `${response.config.url}请求错误，状态码：${response.status}，错误信息：${msg}`
    });
  } catch {
    getMessageApi()?.open({
      type: 'error',
      content: `${response.config.url}请求错误，状态码：${response.status}`
    });
  }
  throw response.data;
};

// 处理权限相关的状态码
const handleAuthError = async (response: any) => {
  if (!IS_LOCAL) {
    await new Promise<void>((resolve) => {
      Modal.warning({
        title: '提示',
        content: ERROR_MESSAGES.UNAUTHORIZED,
        okText: '去登录',
        cancelText: '取消',
        onOk() {
          location.href = login();
          resolve();
        },
        onCancel() {
          resolve();
        }
      });
    });
  } else {
    getMessageApi()?.open({
      type: 'error',
      content: ERROR_MESSAGES.LOGIN_TIMEOUT
    });
  }
  throw response.data;
};

// 处理成功响应
const handleSuccessResponse = async (response: AxiosResponse) => {
  // 统一处理异常业务状态码
  if (!response.data || !SUCCESS_CODES.includes(response.data.status ?? response.data.code)) {
    const msg = response.data.statusInfo || response.data.msg || response.data.message;
    getMessageApi()?.open({
      type: 'error',
      content: msg || '请求失败'
    });
    throw response.data;
  }
  return response.data;
};

// 返回结果处理
const responseHandle: BackendResponseHandle = {
  errorDefault: handleDefaultError,
  success: handleSuccessResponse,
  302: async (response) => {
    if (response.data === '未登录') {
      return handleAuthError(response);
    }
    throw response.data;
  },
  401: async (response) => handleAuthError(response),
  403: async (response) => handleAuthError(response)
};
export default responseHandle;
