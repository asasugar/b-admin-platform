import { Tabs } from 'antd';
import type React from 'react';
import Formily from './tabs/Formily';
import Introduction from './tabs/Introduction';
import TodoDemo from './tabs/TodoDemo';
import ZustandDemo from './tabs/ZustandDemo';
import './Home.less';

const Home: React.FC = () => {
  return (
    <div className='home'>
      <Tabs
        defaultActiveKey='1'
        items={[
          {
            key: '1',
            label: '项目介绍',
            children: <Introduction />
          },
          {
            key: '2',
            label: '待办事项演示',
            children: <TodoDemo />
          },
          {
            key: '3',
            label: 'Formily 演示',
            children: <Formily />
          },
          {
            key: '4',
            label: 'Zustand 演示',
            children: <ZustandDemo />
          }
        ]}
      />
    </div>
  );
};

export default Home;
