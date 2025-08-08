import type { ConfigFunction } from './types';
import prodConfig from './prod';

// 把生产环境的api域名复制下来，改成测试4域名
const domain = prodConfig().domain;
const oapis = prodConfig().oapis;

for (const key in oapis) {
  const api = oapis[key];
  if (api.domain) {
    api.domain = api.domain.replace(new RegExp(`(\.${domain?.sub})`), 'test04$1');
  }
}

const config: ConfigFunction = () => ({
  adminCookieKey: 'myWebsite-intranet-test04-sid',
  oapis: {
    ...oapis,
    // 测试4 环境特有api
  }
});

export default config;