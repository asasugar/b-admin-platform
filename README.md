# B Admin Platform

基于 Turborepo 的微前端管理后台系统，采用 Monorepo 架构，集成多个业务子系统。

## Node.js 版本要求

不同子包对 Node.js 版本有不同要求：

- backend: >= 18.0.0
- react19: >= 18.0.0
- vue3-rolldown-vite: >= 22.0.0（由于使用了 Rolldown-Vite，必须使用 Node.js 22 版本）
- vue3-rsbuild: >= 18.0.0
- services: >= 18.0.0
- utils: >= 18.0.0
- build-utils: >= 18.0.0

推荐使用 Node.js 22 LTS 版本进行开发，以确保所有子包都能正常运行。如果使用较低版本可能会遇到构建错误或其他兼容性问题。

## 技术栈

### 前端

- React 19
- Vue 3
- TypeScript
- Rsbuild & Rolldown-Vite
- TailwindCSS
- Ant Design & Element Plus
- Formily
- More Libraries

### 后端

- Node.js >= 18.0.0
- Koa 3.x
- TypeScript
- ESM 模块系统

## 项目结构

```tree
b-admin-platform/
├── apps/                    # 应用部署目录（预留）
├── packages/               # 包目录
│   ├── react19/              # React 19 演示系统
│   │   ├── src/
│   │   │   ├── pages/     # 页面组件
│   │   │   ├── router/    # 路由配置
│   │   │   ├── services/  # 接口服务
│   │   │   └── utils/     # 工具函数
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── rsbuild.config.ts
│   │   └── tsconfig.json
│   ├── vue3-rolldown-vite/   # Vue3 rolldown-vite 演示系统
│   │   ├── src/
│   │   │   ├── views/     # 页面组件
│   │   │   │   └── tabs/  # 标签页组件
│   │   │   ├── router/    # 路由配置
│   │   │   ├── stores/    # 状态管理
│   │   │   └── assets/    # 静态资源
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   ├── vue3-rsbuild/        # Vue3 rsbuild 演示系统
│   │   ├── src/
│   │   │   ├── views/     # 页面组件
│   │   │   │   └── Home/  # 首页组件
│   │   │   │       └── components/ # 子组件
│   │   │   ├── router/    # 路由配置
│   │   │   ├── stores/    # 状态管理
│   │   │   └── assets/    # 静态资源
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── rsbuild.config.ts
│   │   └── tsconfig.json
│
│   ├── backend/           # 后端服务
│   │   ├── src/
│   │   │   ├── controllers/  # 控制器
│   │   │   ├── middlewares/  # 中间件
│   │   │   │   ├── auth.middleware.ts    # 认证中间件
│   │   │   │   ├── helper.middleware.ts  # 辅助函数中间件
│   │   │   │   ├── notFound.middleware.ts # 404处理中间件
│   │   │   │   └── proxy.middleware.ts   # 代理中间件
│   │   │   ├── routes/       # 路由定义
│   │   │   ├── types/        # 类型定义
│   │   │   ├── utils/        # 工具函数
│   │   │   │   ├── logger/   # 日志工具
│   │   │   │   │   ├── config.ts      # 日志配置
│   │   │   │   │   ├── dateUtils.ts   # 日期工具
│   │   │   │   │   ├── index.ts       # 日志主文件
│   │   │   │   │   └── types.ts       # 日志类型
│   │   │   │   └── proxy.ts           # 代理工具
│   │   │   ├── app.ts        # 应用主文件
│   │   │   └── server.ts     # 服务器启动文件
│   │   ├── logs/         # 日志文件目录
│   │   ├── public/       # 静态资源
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── services/         # 共享服务包
│   │   ├── src/          # 源码目录
│   │   ├── dist/         # 构建输出
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tsup.config.ts # 构建配置
│   └── utils/            # 共享工具包
│       ├── src/          # 源码目录
│       ├── dist/         # 构建输出
│       ├── package.json
│       ├── tsconfig.json
│       └── tsup.config.ts # 构建配置
├── config/               # 全局配置目录
│   ├── tsup/            # tsup 配置
│   │   └── config.ts    # 基础配置
│   ├── rsbuild/         # Rsbuild 构建配置
│   │   ├── base.ts      # 基础配置
│   │   ├── react.ts     # React 配置
│   │   ├── vue3.ts      # Vue3 配置
│   │   └── types.ts     # 类型定义
│   ├── server/          # 服务器配置
│   │   ├── default.ts   # 默认配置
│   │   ├── local.ts     # 本地环境
│   │   ├── pre.ts       # 预发环境
│   │   ├── prod.ts      # 生产环境
│   │   ├── test3.ts     # 测试环境3
│   │   ├── test4.ts     # 测试环境4
│   │   └── types.ts     # 类型定义
│   └── typescript/      # TypeScript 配置
│       ├── base.json    # 基础配置
│       ├── react.json   # React 配置
│       └── vue.json     # Vue 配置
├── scripts/             # 工具脚本
│   └── stop-ports.ts   # 停止端口占用脚本
├── bin/                 # 二进制文件目录
├── .changeset/         # Changeset 配置
├── .husky/             # Git hooks 配置
├── .vscode/            # VSCode 配置
├── .turbo/             # Turborepo 缓存
├── biome.json         # Biome 配置文件
├── package.json       # 工作空间配置
├── pnpm-workspace.yaml # pnpm 工作空间配置
├── pnpm-lock.yaml     # pnpm 锁定文件
├── tsconfig.json      # TypeScript 配置
└── turbo.json        # Turborepo 配置
```

## 开发环境

### 要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装

```bash
# 安装依赖
pnpm install
```

### 开发命令

```bash
# 启动特定应用
pnpm dev:app # 只启动 .env 文件下配置的 APP 服务 和 backend 服务
pnpm dev:apps # 启动 backend 和 所有 前端 APP 服务

# 启动所有服务
pnpm dev

# 代码检查
pnpm lint
```

### 构建命令

```bash
pnpm build # 构建所有项目
pnpm build:app # 构建指定前端 APP 应用, 本地需要配置 .env 文件，CI 环境需要配置自动读取服务节点名称 APP_NAME
```

### 启动命令

```bash
pnpm start:local # 打包前后端项目，启动 KOA 服务，托管 apps/{前端应用} 项目（用于预览部署后的运行效果）
pnpm start:prod # 启用 KOA 服务，托管 apps/{前端应用} 项目
```

### 其他命令

```bash
pnpm clean # 清理构建缓存
pnpm lint # 运行 biome 检查
pnpm format # 运行 biome 格式化
pnpm check # 运行 biome 检查并格式化
pnpm c:add # 子依赖包更新
pnpm c:version # 子依赖包版本升级
pnpm publish:all # 发布所有子依赖包
```

## 子包说明

### react19

React 19 演示系统，使用 Rsbuild 构建，集成了：

- Ant Design 组件库
- Formily 表单解决方案
- Zustand 状态管理
- 接口代理演示

### vue3-rolldown-vite

Vue 3 演示系统，使用 Rolldown-Vite 构建，集成了：

- Element Plus 组件库
- Pinia 状态管理
- 自动导入组件和API
- 接口代理演示

注意事项：

1. 开发时需要同时启动后端服务
2. 组件和API自动导入功能由 unplugin-auto-import 和 unplugin-vue-components 提供
3. 使用 Element Plus 组件库，支持按需加载

### vue3-rsbuild

Vue 3 演示系统，使用 Rsbuild 构建，集成了：

- Element Plus 组件库
- Pinia 状态管理
- 自动导入组件和API
- 接口代理演示

注意事项：

1. 开发时需要同时启动后端服务
2. 组件和API自动导入功能由 unplugin-auto-import 和 unplugin-vue-components 提供
3. 使用 Element Plus 组件库，支持按需加载

## 开发规范

### 前端规范

1. 使用 Function Component 和 Hooks（React）/ Composition API（Vue）
2. 遵循 Biome 配置进行除了 '*.vue' 以外的代码格式化
3. 使用 TailwindCSS 进行样式开发
4. 保持 React 和 Vue 项目功能的一致性

### 后端规范

1. 使用 ESM 模块系统
2. 统一错误处理
3. API 遵循 RESTful 规范
4. 使用 TypeScript 类型检查
5. 使用中间件模式处理通用逻辑

### Git 规范

- feat: 新功能
- fix: 修复
- docs: 文档
- style: 格式
- refactor: 重构
- test: 测试
- chore: 构建

## 文档

- [Ant Design of React](https://ant.design/docs/react/introduce-cn/)
- [Element Plus](https://element-plus.org/zh-CN/)
- [Formilyjs](https://formilyjs.org/zh-CN/guide)
- [Koajs](https://koajs.com/#)
- [Rsbuild](https://rsbuild.rs/zh/guide/start/)
- [Vite](https://cn.vitejs.dev/)
- [Turborepo](https://turborepo.com/docs)
- [Biome](https://biomejs.dev/guides/getting-started/)

## License

MIT
