import inject from '../inject';
import type { LoginParams, LoginResponse } from '../types/myWebsite';

// 基础URL配置
const API_BASE_URLS = {
  MYWEBSITE: '/api/proxy/myWebsite'
} as const;

/**
 * mock 登录相关接口
 */
export const myWebsiteApi = {
  login: inject<LoginResponse, LoginParams>(`${API_BASE_URLS.MYWEBSITE}/user/login`),
  getUserInfo: inject<LoginResponse, LoginParams>(`${API_BASE_URLS.MYWEBSITE}/user/info`, 'get')
};
