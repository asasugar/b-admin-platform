import { createDelete, createGet, createPost } from '@b-admin-platform/utils';

// 基础URL配置
const API_BASE_URLS = {
  OTHERWEBSITE: '/api/proxy/otherWebsite'
} as const;

// 创建服务请求实例
const createOtherWebsiteRequest = (method: typeof createGet | typeof createPost) =>
  method(API_BASE_URLS.OTHERWEBSITE);

/**
 * mock 登录相关接口
 */
export const otherWebsiteApi = {
  getTodos: createOtherWebsiteRequest(createGet)('/todo/list'),
  createTodo: createOtherWebsiteRequest(createPost)('/todo/create'),
  updateTodo: createOtherWebsiteRequest(createPost)('/todo/update'),
  deleteTodo: createOtherWebsiteRequest(createDelete)('/todo/delete')
};
