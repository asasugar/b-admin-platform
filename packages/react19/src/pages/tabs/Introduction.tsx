import { List, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Introduction = () => {
  return (
    <div>
      <Title level={2}>项目介绍</Title>
      <Paragraph>
        这是一个基于 Turborepo 的 monorepo 项目，用于演示多应用开发和管理。主要特性包括：
      </Paragraph>
      <List>
        <List.Item>
          <strong>Turborepo</strong> - 高性能构建系统，支持增量构建、任务编排等
        </List.Item>
        <List.Item>
          <strong>PNPM</strong> - 高效的包管理器，支持 workspace 特性
        </List.Item>
        <List.Item>
          <strong>React 19</strong> - 使用最新的 React 特性
        </List.Item>
        <List.Item>
          <strong>TypeScript</strong> - 提供类型安全和更好的开发体验
        </List.Item>
      </List>

      <Title level={3} style={{ marginTop: 24 }}>项目结构</Title>
      <List>
        <List.Item>
          <strong>packages/backend</strong> - Node.js 后端服务，处理 API 请求和代理
        </List.Item>
        <List.Item>
          <strong>packages/services</strong> - 前端 API 服务层，统一管理接口调用
        </List.Item>
        <List.Item>
          <strong>packages/utils</strong> - 通用工具库，包含请求封装等
        </List.Item>
        <List.Item>
          <strong>packages/react19</strong> - 示例应用，展示各种功能
        </List.Item>
      </List>

      <Title level={3} style={{ marginTop: 24 }}>开发特性</Title>
      <List>
        <List.Item>
          <strong>热更新</strong> - 支持依赖包的实时编译和更新
        </List.Item>
        <List.Item>
          <strong>接口代理</strong> - 统一的接口代理层，支持多环境配置
        </List.Item>
        <List.Item>
          <strong>组件库</strong> - 集成 Ant Design、Formily 等优秀的组件库
        </List.Item>
        <List.Item>
          <strong>状态管理</strong> - 使用 Zustand 进行轻量级状态管理
        </List.Item>
      </List>
    </div>
  );
};

export default Introduction;
