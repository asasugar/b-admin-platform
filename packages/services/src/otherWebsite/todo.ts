import { createDelete, createGet, createPost } from '@b-admin-platform/utils';

// 基础URL配置
const API_BASE_URLS = {
  OTHERWEBSITE: '/api/proxy/otherWebsite'
} as const;

// 创建服务请求实例
const createOtherWebsiteRequest = (method: typeof createGet | typeof createPost | typeof createDelete) =>
  method(API_BASE_URLS.OTHERWEBSITE);

/**
 * mock 登录相关接口
 */
export const otherWebsiteApi = {
  getTodos: createOtherWebsiteRequest(createGet)('/todo/list'),
  createTodo: createOtherWebsiteRequest(createPost)('/todo/create'),
  updateTodo: createOtherWebsiteRequest(createPost)('/todo/update'),
  deleteTodo: (params: { id: number }) => createOtherWebsiteRequest(createDelete)(`/todo/delete/${params.id}`)({}) // 空对象作为参数，因为 id 已经在路径中
};
