import type React from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './router';
import './App.less';
import { MessageProvider } from './contexts/MessageContext';

const App: React.FC = () => {
  const elements = useRoutes(routes);
  return (
    <MessageProvider>
      <div className='app-container'>{elements as React.ReactElement}</div>
    </MessageProvider>
  );
};

export default App;
