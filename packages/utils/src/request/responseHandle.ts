import { message } from 'antd';
import type { BackendResponseHandle } from './types';

// 返回结果处理
// 自定义约定接口返回{code: xxx, result: xxx, message:'err message'},根据api模拟，具体可根据业务调整
const responseHandle: BackendResponseHandle = {
  200: (response) => {
    return Promise.resolve(response.data);
  },
  201: (response) => {
    message.warning(`参数异常:${response.data.message}`);
    return Promise.resolve(response.data);
  },
  301: (response) => {
    message.warning('接口地址不存在');
    return Promise.resolve(response.data);
  },
  302: (response) => {
    message.warning('接口地址不存在');
    return Promise.resolve(response.data);
  },
  400: (response) => {
    message.error('接口请求错误');
    return Promise.reject(response.data);
  },
  404: (response) => {
    message.error('接口地址不存在');
    return Promise.reject(response.data);
  },
  405: (response) => {
    message.error('接口请求方法错误');
    return Promise.reject(response.data);
  },
  500: (response) => {
    message.error('服务器错误');
    return Promise.reject(response.data);
  }
};
export default responseHandle;
