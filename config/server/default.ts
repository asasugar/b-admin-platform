import type { ConfigFunction } from './types';

const config: ConfigFunction = () => ({
  // 域名配置
  domain: {
    top: 'com', // 顶级域名
    sub: 'myWebsite', // 二级域名
    main: 'myWebsite.com' // 主域名
  },
});

export default config;
