/** ↓↓↓↓↓要切换本地环境，请改这里↓↓↓↓↓ **/
const env = 'test03-4'; // test03, test04 或 pre
const laneEnv = env.replace(/-[1-9]/g, '');
const testEnvConfig = require(`./${laneEnv.replace('0', '')}`).default();

const config = () => {
  return {
    localEnv: env,
    ...testEnvConfig,
    adminCookieKey: `myWebsite-intranet-${laneEnv}-sid`,
    // 值存在 本地开启自动登录
    mockLogin: {
      enabled: true,
      mockUrl: 'http://localhost:3000/api/user/login', // 替换成登录接口
      mockData: {
        username: 'admin',
        password: 'admin123'
      }
    }
  };
};

export default config;
