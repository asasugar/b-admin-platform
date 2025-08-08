import fs from 'node:fs';
import path from 'node:path';
import { packagesPath } from '@/utils/path';

/**
 * 子应用配置
 */
export interface AppConfig {
  name: string;
  path: string;
  staticPrefix: string;
  enabled: boolean;
}

/**
 * 从packages目录自动发现子应用
 */
function discoverAppsFromPackages(): string[] {
  const apps: string[] = [];

  try {
    // 读取packages目录下的所有子目录
    const packageDirs = fs.readdirSync(packagesPath, { withFileTypes: true });

    for (const dir of packageDirs) {
      if (dir.isDirectory()) {
        const packageJsonPath = path.join(packagesPath, dir.name, 'package.json');

        try {
          // 读取package.json文件
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
          const packageName = packageJson.name;

          // 检查是否以@b-admin-platform/frontend开头
          if (packageName?.startsWith('@b-admin-platform/frontend/')) {
            // 提取应用名称（去掉前缀）
            const appName = packageName.replace('@b-admin-platform/frontend/', '');
            if (appName) {
              apps.push(appName);
            }
          }
        } catch (error) {
          // 忽略无法读取的package.json文件
          console.warn(`无法读取 ${packageJsonPath}:`, error);
        }
      }
    }
  } catch (error) {
    console.warn('无法读取packages目录:', error);
  }

  return apps;
}

/**
 * 默认子应用配置
 */
export const defaultAppsConfig: AppConfig[] = [
  {
    name: 'demo',
    path: '/demo',
    staticPrefix: '/static/',
    enabled: true
  }
  // 可以在这里添加更多子应用配置
];

/**
 * 获取启用的子应用名称列表
 */
export function getEnabledApps(): string[] {
  const configApps = defaultAppsConfig.filter((app) => app.enabled).map((app) => app.name);

  // 合并配置的应用和自动发现的应用
  const discoveredApps = discoverAppsFromPackages();
  const allApps = [...new Set([...configApps, ...discoveredApps])];

  // console.log('配置的应用:', configApps);
  // console.log('自动发现的应用:', discoveredApps);
  // console.log('所有启用的应用:', allApps);

  return allApps;
}

/**
 * 获取默认子应用
 */
export function getDefaultApp(): string {
  const enabledApps = getEnabledApps();

  // 优先顺序：
  // 1. 如果配置中有 'demo' 应用，使用 'demo'
  // 2. 否则使用第一个启用的应用
  // 3. 最后回退到 'demo'
  if (enabledApps.includes('demo')) {
    return 'demo';
  }

  return enabledApps.length > 0 ? enabledApps[0] : 'demo';
}
