import inject from '../inject';
import type { FormilyUserQueryParams, FormilyUserQueryResponse } from '../types/myWebsite';

// 基础URL配置
const API_BASE_URLS = {
  MYWEBSITE: '/api/proxy/myWebsite'
} as const;


/**
 * Formily 相关接口
 */
export const formilyApi = {
  getUsers: inject<FormilyUserQueryResponse, FormilyUserQueryParams>(`${API_BASE_URLS.MYWEBSITE}/formily/getUsers`, 'get')
};
