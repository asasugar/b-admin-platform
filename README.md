# B Admin Platform

基于 Turborepo 的微前端管理后台系统，采用 Monorepo 架构，集成多个业务子系统。

## 技术栈

### 前端

- React 19
- TypeScript
- Rsbuild
- TailwindCSS
- Ant Design
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
│   ├── react19/              # 演示系统
│   │   ├── src/
│   │   │   ├── pages/     # 页面组件
│   │   │   ├── router/    # 路由配置
│   │   │   ├── services/  # 接口服务
│   │   │   └── utils/     # 工具函数
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── rsbuild.config.ts
│   │   └── tsconfig.json
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
│   ├── biome/           # Biome 配置
│   │   ├── base.json    # 基础配置
│   │   └── react.json   # React 配置
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
pnpm dev:all # 启动 backend 和 所有 前端 APP 服务

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

## 开发规范

### 前端规范

1. 使用 Function Component 和 Hooks
2. 遵循 Biome 配置进行代码格式化
3. 使用 TailwindCSS 进行样式开发

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
- [Formilyjs](https://formilyjs.org/zh-CN/guide)
- [Koajs](https://koajs.com/#)
- [Rsbuild](https://rsbuild.rs/zh/guide/start/)
- [Turborepo](https://turborepo.com/docs)
- [Biome](https://biomejs.dev/guides/getting-started/)

## License

MIT
