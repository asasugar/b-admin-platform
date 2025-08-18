import inject from '../inject';
import type {
  TodoDeleteParams,
  TodoItem,
  TodoQueryParams,
  TodoUpdateParams
} from '../types/otherWebsite';

// 基础URL配置
const API_BASE_URLS = {
  OTHERWEBSITE: '/api/proxy/otherWebsite'
} as const;

/**
 * mock 登录相关接口
 */
export const otherWebsiteApi = {
  getTodos: inject<TodoItem[]>(`${API_BASE_URLS.OTHERWEBSITE}/todo/list`, 'get'),
  createTodo: inject<TodoItem, TodoQueryParams>(`${API_BASE_URLS.OTHERWEBSITE}/todo/create`),
  updateTodo: inject<TodoItem, TodoUpdateParams>(
    `${API_BASE_URLS.OTHERWEBSITE}/todo/update`,
    'put'
  ),
  deleteTodo: inject<TodoItem, TodoDeleteParams>(
    `${API_BASE_URLS.OTHERWEBSITE}/todo/delete`,
    'delete'
  )
};
