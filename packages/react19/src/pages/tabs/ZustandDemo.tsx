import { Button, Card, Typography } from 'antd';
import { useCounterStore } from '../../stores/counter';

const { Title, Paragraph } = Typography;

const ZustandDemo = () => {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div>
      <Title level={2}>Zustand 状态管理演示</Title>
      <Paragraph>
        Zustand 是一个轻量级的状态管理库，使用简单、体积小、性能好。
        下面是一个简单的计数器示例：
      </Paragraph>

      <Card style={{ width: 300, marginTop: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={1}>{count}</Title>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <Button onClick={decrement}>-1</Button>
            <Button onClick={reset}>重置</Button>
            <Button type="primary" onClick={increment}>+1</Button>
          </div>
        </div>
      </Card>

      <Title level={3} style={{ marginTop: 24 }}>特点</Title>
      <ul>
        <li>简单易用 - 使用 hooks 风格的 API</li>
        <li>轻量级 - 体积只有 1KB</li>
        <li>类型安全 - 完整的 TypeScript 支持</li>
        <li>高性能 - 基于订阅的更新机制</li>
      </ul>
    </div>
  );
};

export default ZustandDemo;
