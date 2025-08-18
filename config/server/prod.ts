import type { ConfigFunction } from './types';

const config: ConfigFunction = () => ({
  adminCookieKey: 'myWebsite-intranet-prod-sid',
  oapis: {
    // 需要代理转发的接口
    myWebsite: {
      domain: 'http://localhost:3000/api/myWebsite'
    },
    otherWebsite: {
      domain: 'http://localhost:3000/api/otherWebsite'
    }
  },
});

export default config;