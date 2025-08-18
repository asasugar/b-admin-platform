import type { RouterContext } from '@koa/router';
import Router from '@koa/router';
import { todoService } from '../../services/otherWebsite/todo.service';
import type { CreateTodoDTO, UpdateTodoDTO } from '../../types/otherWebsite/todo';

const router = new Router({
  prefix: '/api/otherWebsite/todo'
});

// 获取所有待办事项
router.get('/list', async (ctx: RouterContext) => {
  try {
    const todos = await todoService.getTodos();
    ctx.body = {
      code: 0,
      data: todos,
      message: '获取待办事项列表成功'
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: error instanceof Error ? error.message : '获取待办事项列表失败'
    };
  }
});

// 创建待办事项
router.post('/create', async (ctx: RouterContext) => {
  try {
    const dto: CreateTodoDTO = ctx.request.body;
    const todo = await todoService.createTodo(dto);
    ctx.body = {
      code: 0,
      data: todo,
      message: '创建待办事项成功'
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      code: 400,
      message: error instanceof Error ? error.message : '创建待办事项失败'
    };
  }
});

// 更新待办事项
router.put('/update', async (ctx: RouterContext) => {
  try {
    const dto: UpdateTodoDTO = ctx.request.body;
    const todo = await todoService.updateTodo(dto);
    ctx.body = {
      code: 0,
      data: todo,
      message: '更新待办事项成功'
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      code: 400,
      message: error instanceof Error ? error.message : '更新待办事项失败'
    };
  }
});

// 删除待办事项
router.delete('/delete/:id', async (ctx: RouterContext) => {
  try {
    const id = Number(ctx.params.id);
    await todoService.deleteTodo(id);
    ctx.body = {
      code: 0,
      data: null,
      message: '删除待办事项成功'
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      code: 400,
      message: error instanceof Error ? error.message : '删除待办事项失败'
    };
  }
});

export const otherWebsiteTodoController = router;
