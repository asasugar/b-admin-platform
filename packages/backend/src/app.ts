import bodyParser from '@koa/bodyparser';
import Koa from 'koa';
import serve from 'koa-static';
import { appsPath } from '@/utils/path';
import { formilyController } from './controllers/myWebsite/formily.controller';
import { myWebsiteUserController } from './controllers/myWebsite/user.controller';
import { otherWebsiteTodoController } from './controllers/otherWebsite/todo.controller';
import { authMiddleware } from './middlewares/auth.middleware';
import { helperMiddleware } from './middlewares/helper.middleware';
import { notFoundMiddleware } from './middlewares/notFound.middleware';
import { proxyMiddleware } from './middlewares/proxy.middleware';

const app = new Koa();

// 基础中间件
app.use(helperMiddleware()); // 帮助函数中间件


// 代理中间件
// Please make sure that `koa-proxies` is in front of `koa-bodyparser` to avoid this [issue 55](https://github.com/vagusX/koa-proxies/issues/55)
app.use(await proxyMiddleware());
app.use(bodyParser()); // 解析请求体中间件

// myWebsite子系统 - 用户路由
app.use(myWebsiteUserController.routes());
app.use(myWebsiteUserController.allowedMethods());

// otherWebsite子系统 - 待办事项路由
app.use(otherWebsiteTodoController.routes());
app.use(otherWebsiteTodoController.allowedMethods());

// myWebsite子系统 - Formily路由
app.use(formilyController.routes());
app.use(formilyController.allowedMethods());


if (process.env.NODE_ENV === 'production') {
  // 前端应用静态文件服务 - 优先级最高
  app.use(serve(appsPath));
} else {
  // 本地开发走身份验证中间件
  app.use(await authMiddleware());
}

// 404 前端路由处理中间件
app.use(notFoundMiddleware());
export default app;
