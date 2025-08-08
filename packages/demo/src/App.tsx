import type React from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './router';
import './App.less';

const App: React.FC = () => {
  const elements = useRoutes(routes);
  return <div className='app-container'>{elements as React.ReactElement}</div>;
};

export default App;
