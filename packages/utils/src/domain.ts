export const getEnvironment = async () => {
  const hostname = window.location.hostname;
  const config = (await import('../../../config/server/local')).default();

  const environments = [
    { key: 'localhost', value: config.localEnv },
    { key: '127.0.0.1', value: config.localEnv },
    { key: 'test03', value: 'test03' },
    { key: 'test04', value: 'test04' },
    { key: 'pre', value: 'pre' }
  ];

  const matchedEnv = environments.find((env) => hostname.includes(env.key));
  return matchedEnv ? matchedEnv.value : '';
};

export const isProd = async () => (await getEnvironment()) === '';

// 获取域名后缀
const getDomainSuffix = () => {
  // 替换成公司网站域名
  const domainSuffixArr = location.hostname.match(/(myWebsite)((\.[a-zA-Z0-9]+)+)$/);
  return domainSuffixArr?.[0] || 'myWebsite.com';
};

// 获取当前环境
const getCurrentEnv = () => {
  const hostname = location.hostname;
  if (/test03-\d/.test(hostname)) {
    return hostname.match(/test03-\d/)?.[0] || '';
  }

  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return 'test04'; // 默认本地环境
  }

  if (hostname.includes('test03')) return 'test03';
  if (hostname.includes('test04')) return 'test04';
  if (hostname.includes('pre')) return 'pre';

  return ''; // 生产环境
};

// 创建域名生成函数
const createDomain = (prefix: string) => {
  const env = getCurrentEnv();
  const domainSuffix = getDomainSuffix();
  return `//${prefix}${env}.${domainSuffix}`;
};


/** 登录页面 */
export const login = () => {
  const env = getCurrentEnv();
  const domainSuffix = getDomainSuffix();
  return `//admin${env}.${domainSuffix}/login`; // 替换公共的认证登录页面地址
};


export default {
  createDomain,
  login,
  getEnvironment,
  isProd,
};
