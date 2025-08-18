import { createGet } from '@b-admin-platform/utils';

// 基础URL配置
const API_BASE_URLS = {
  MYWEBSITE: '/api/proxy/myWebsite'
} as const;

// 创建服务请求实例
const createMyWebsiteRequest = (method: typeof createGet) =>
  method(API_BASE_URLS.MYWEBSITE);

export interface FormilyUserQueryParams {
  status?: number;
  name?: string;
  age?: string;
  address?: string;
}

export interface FormilyUserItem {
  id: number;
  name: string;
  age: number;
  address: string;
  status: number;
}

export interface FormilyUserQueryResponse {
  list: FormilyUserItem[];
  total: number;
}

/**
 * Formily 相关接口
 */
export const formilyApi = {
  getUsers: createMyWebsiteRequest(createGet)('/formily/getUsers')
};
