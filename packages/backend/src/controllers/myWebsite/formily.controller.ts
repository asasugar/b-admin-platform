import type { FormilyUserQueryParams } from '@b-admin-platform/services';
import type { RouterContext } from '@koa/router';
import Router from '@koa/router';
import { formilyService } from '@/services/myWebsite/formily.service';

const router = new Router({
  prefix: '/api/myWebsite/formily'
});

// 查询用户数据
router.get('/getUsers', async (ctx: RouterContext) => {
  try {
    const dto: FormilyUserQueryParams = ctx.request.query;

    const data = await formilyService.getUsers(dto);
    ctx.body = {
      code: 0,
      data,
      message: '查询成功'
    };
  } catch (error) {
    ctx.helper.error({
      message: '查询失败',
      error: error as Error
    });
  }
});

export const formilyController = router;
