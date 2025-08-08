import type { ConfigFunction } from './types';
import prodConfig from './prod';

// 把生产环境的api域名复制下来，改成测试3域名
const domain = prodConfig().domain;
const oapis = prodConfig().oapis;

for (const key in oapis) {
  const api = oapis[key];
  if (api.domain) {
    api.domain = api.domain.replace(new RegExp(`(\.${domain?.sub})`), 'test03$1');
  }
}

const config: ConfigFunction = () => ({
  adminCookieKey: 'myWebsite-intranet-test03-sid',
  oapis: {
    ...oapis,
    // 测试3 环境特有api
  }
});

export default config;