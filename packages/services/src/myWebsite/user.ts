import { createGet, createPost } from '@b-admin-platform/utils';

// 基础URL配置
const API_BASE_URLS = {
  MYWEBSITE: '/api/proxy/myWebsite'
} as const;

// 创建服务请求实例
const createMyWebsiteRequest = (method: typeof createGet | typeof createPost) =>
  method(API_BASE_URLS.MYWEBSITE);

/**
 * mock 登录相关接口
 */
export const myWebsiteApi = {
  login: createMyWebsiteRequest(createPost)('/user/login'),
  getUserInfo: createMyWebsiteRequest(createGet)('/user/info')
};
