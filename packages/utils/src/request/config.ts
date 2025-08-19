import type { MessageInstance } from 'antd/es/message/interface';

let globalMessageApi: MessageInstance | undefined;

export const configureRequest = (config: { messageApi?: MessageInstance }) => {
  globalMessageApi = config.messageApi;
};

export const getMessageApi = () => globalMessageApi;