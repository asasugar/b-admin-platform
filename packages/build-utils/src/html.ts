import type { PortManager } from './PortManager';

/**
 * 生成前端首页HTML
 * @returns HTML字符串
 */
export function generateFrontendIndexHtml(): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/react.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body>
  <div id="root"></div>
</body>

</html>
    `;
}

/**
 * 获取应用图标
 * @param appName 应用名称
 * @returns 应用图标
 */
function getAppIcon(appName: string): string {
  const iconMap: Record<string, string> = {
    demo: '📊',
    admin: '⚙️',
    dashboard: '📈',
    user: '👥',
    order: '📦',
    product: '🛍️',
    report: '📋',
    setting: '⚙️'
  };
  return iconMap[appName] || '🔧';
}

/**
 * 动态生成首页HTML
 * @param allApps 所有应用列表
 * @param portManager 端口管理器实例
 * @returns HTML字符串
 */
export async function generateBackendIndexHtml(
  allApps: string[],
  portManager: PortManager
): Promise<string> {
  const allPorts = portManager.getAllPorts();

  const appsInfo = allApps.map((appName) => ({
    name: appName,
    path: `/${appName}/`,
    title: `${appName.charAt(0).toUpperCase() + appName.slice(1)} - 管理系统`,
    port: allPorts[appName],
    icon: getAppIcon(appName)
  }));

  const appListHtml =
    appsInfo.length > 0
      ? appsInfo
          .map(
            (app) => `
        <li>
          <a href="${app.path}">
            <div class="app-info">
              <span>${app.icon}</span>
              <div>
                <div>${app.title}</div>
                <div class="app-meta">端口: ${app.port} | 路径: ${app.path}</div>
              </div>
            </div>
          </a>
        </li>
      `
          )
          .join('')
      : '<li class="no-apps">📱 暂无可用的子应用</li>';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>B Admin Platform - 后台管理系统</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333;
      text-align: center;
      margin-bottom: 30px;
    }
    .app-list {
      list-style: none;
      padding: 0;
    }
    .app-list li {
      margin: 10px 0;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 4px;
      border-left: 4px solid #007bff;
      transition: all 0.3s ease;
    }
    .app-list li:hover {
      background: #e9ecef;
      transform: translateX(5px);
    }
    .app-list a {
      color: #007bff;
      text-decoration: none;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .app-list a:hover {
      text-decoration: underline;
    }
    .app-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .app-meta {
      font-size: 12px;
      color: #6c757d;
    }
    .status {
      color: #28a745;
      font-weight: 500;
    }
    .no-apps {
      text-align: center;
      color: #6c757d;
      padding: 30px;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>B Admin Platform</h1>
    <p class="status">✅ 后端服务运行中</p>
    <p style="color: #666; font-size: 14px; text-align: center;">
      发现 ${appsInfo.length} 个子应用
    </p>

    <h2>可用的子应用</h2>
    <ul class="app-list">${appListHtml}</ul>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
    <p style="text-align: center; color: #666; font-size: 14px;">
      Powered by Koa.js & Node.js
    </p>
  </div>

  <!-- 引入 Admin Platform API -->
  <script src="/admin-platform-api.js"></script>
</body>
</html>`;
}
