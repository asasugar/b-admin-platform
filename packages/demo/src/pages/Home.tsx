import { List, Typography } from 'antd';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.less';
import { myWebsiteApi, otherWebsiteApi } from '@b-admin-platform/services';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>({});
  useEffect(() => {
    const fetchLinkTypeEnum = async () => {
      const res = await myWebsiteApi.getUserInfo();
      console.log(res);
      if (res.code === 0) {
        setUserInfo(res.data);
      }
    };
    fetchLinkTypeEnum();
  }, []);

  useEffect(() => {
    const fetchTodos = async () => {
      const res = await otherWebsiteApi.getTodos();
      console.log(res);
    };
    fetchTodos();
  }, []);
  return (
    <div className='home'>
      <h1 className='text-3xl font-bold underline text-mint-500'>Hello world!</h1>
      <Title>欢迎使用 React 子应用demo</Title>
      <Paragraph>这是一个基于 React 19 的微前端子应用，包含以下特性：</Paragraph>
      <List>
        <List.Item>React 19 + TypeScript</List.Item>
        <List.Item>Ant Design 组件库</List.Item>
        <List.Item>
          <Link to='/formily'>Formily 表单库</Link>
        </List.Item>
        <List.Item>React Router 6 路由</List.Item>
        <List.Item>微前端框架支持</List.Item>
      </List>
      <List>
        <List.Item>
          <div>
            <div>用户名：{userInfo.username}</div>
            <div>邮箱：{userInfo.email}</div>
            <div>角色：{userInfo.roles}</div>
          </div>
        </List.Item>
      </List>
    </div>
  );
};

export default Home;
