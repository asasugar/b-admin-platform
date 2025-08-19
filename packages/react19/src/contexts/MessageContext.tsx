import { configureRequest } from '@b-admin-platform/utils';
import { message } from 'antd';
import { createContext, useContext, useEffect } from 'react';

const MessageContext = createContext<ReturnType<typeof message.useMessage>[0]>(null!);

export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    configureRequest({ messageApi });
    return () => {
      configureRequest({});
    };
  }, [messageApi]);

  return (
    <MessageContext.Provider value={messageApi}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const messageApi = useContext(MessageContext);
  if (!messageApi) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return messageApi;
};
