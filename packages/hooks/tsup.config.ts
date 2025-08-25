import { createTsupConfig } from '../../config/tsup/config';

export default createTsupConfig({
  external: ['react', 'react-dom', 'react-router-dom', 'antd'],
  esbuildOptions(options) {
    options.jsx = 'automatic'
  }
});
