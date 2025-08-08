import { ConfigProvider } from 'antd';
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
// 渲染函数
export const render = () => {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error('Root element not found');
    return;
  }

  const root: Root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ConfigProvider>
        <BrowserRouter basename={`/${process.env.APP}`}>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </React.StrictMode>
  );
};

render();
