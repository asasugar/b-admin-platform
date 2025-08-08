import type { ConfigFunction } from './types';
import prodConfig from './prod';

// 把生产环境的api域名复制下来，改成预生产域名
const domain = prodConfig().domain;
const oapis = prodConfig().oapis;

for (const key in oapis) {
  const api = oapis[key];
  if (api.domain) {
    api.domain = api.domain.replace(new RegExp(`(\.${domain?.sub})`), 'pre$1');
  }
}

const config: ConfigFunction = () => ({
  adminCookieKey: 'myWebsite-intranet-pre-sid',
  oapis
});

export default config;