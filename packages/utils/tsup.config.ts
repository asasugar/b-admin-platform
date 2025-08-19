import { createTsupConfig } from '../../config/tsup/config';

export default createTsupConfig({
  external: ['axios', 'antd'],
});
