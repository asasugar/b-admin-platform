import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 端口管理器配置选项
 */
export interface PortManagerOptions {
  /** 起始端口号，默认为 8000 */
  startPort?: number;
  /** 端口递增步长，默认为 1 */
  step?: number;
  /** packages 目录路径，默认自动检测 */
  packagesPath?: string;
  /** 是否打印日志，默认为 true */
  printLog?: boolean;
}

/**
 * 端口管理器单例类
 * 负责为应用分配和管理不重复的递增端口号
 */
export class PortManager {
  static instance: PortManager | null = null;

  private readonly packagesPath: string;
  private readonly startPort: number;
  private readonly step: number;
  private readonly printLog: boolean;
  private cachedApps: string[] | null = null;
  private cachedPortMap: Record<string, number> | null = null;

  constructor(options: PortManagerOptions = {}) {
    this.packagesPath = options.packagesPath || path.resolve(__dirname, '../../../packages');
    this.startPort = options.startPort ?? 8000;
    this.step = options.step ?? 1;
    this.printLog = options.printLog ?? true;
  }

  /**
   * 获取端口管理器单例实例
   * @param options 配置选项（仅在第一次调用时生效）
   * @returns PortManager 实例
   */
  public static getInstance(options?: PortManagerOptions): PortManager {
    if (PortManager.instance === null) {
      PortManager.instance = new PortManager(options);
      if (PortManager.instance.printLog) {
        console.log('🚀 端口管理器已初始化');
      }
    }
    return PortManager.instance;
  }

  /**
   * 发现所有前端应用
   * @returns 应用名称数组
   */
  private discoverApps(): string[] {
    if (this.cachedApps !== null) {
      return this.cachedApps;
    }

    const apps: string[] = [];

    try {
      const packageDirs = fs.readdirSync(this.packagesPath, { withFileTypes: true });

      for (const dir of packageDirs) {
        if (dir.isDirectory()) {
          const packageJsonPath = path.join(this.packagesPath, dir.name, 'package.json');

          try {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            const packageName = packageJson.name;

            if (packageName?.startsWith('@b-admin-platform/frontend/')) {
              const appName = packageName.replace('@b-admin-platform/frontend/', '');
              if (appName) {
                apps.push(appName);
              }
            }
          } catch (error) {
            console.warn(`无法读取 ${packageJsonPath}:`, error);
          }
        }
      }
    } catch (error) {
      console.warn('无法读取packages目录:', error);
    }

    // 对应用名进行排序，确保端口分配的一致性
    this.cachedApps = apps.sort();

    return this.cachedApps;
  }

  /**
   * 生成端口映射
   * @returns 应用名到端口号的映射
   */
  private generatePortMap(): Record<string, number> {
    if (this.cachedPortMap !== null) {
      return this.cachedPortMap;
    }

    const apps = this.discoverApps();
    const portMap: Record<string, number> = {};

    apps.forEach((appName, index) => {
      portMap[appName] = this.startPort + index * this.step;
    });

    this.cachedPortMap = portMap;

    return portMap;
  }

  /**
   * 获取指定应用的端口号
   * @param appName 应用名称
   * @returns 端口号
   */
  public getAppPort(appName: string): number {
    const portMap = this.generatePortMap();
    const port = portMap[appName];

    if (this.printLog) {
      console.log('🔌 生成端口映射:', {
        appName,
        port
      });
    }
    if (!port) {
      console.warn(`⚠️  应用 "${appName}" 未找到对应端口，使用默认端口 ${this.startPort}`);
      return this.startPort;
    }

    return port;
  }

  /**
   * 获取所有应用的端口映射
   * @returns 完整的端口映射对象
   */
  public getAllPorts(): Record<string, number> {
    return { ...this.generatePortMap() };
  }

  /**
   * 获取所有已发现的应用名称
   * @returns 应用名称数组
   */
  public getAllApps(): string[] {
    return [...this.discoverApps()];
  }

  /**
   * 清除所有缓存，强制重新扫描和生成
   */
  public clearCache(): void {
    this.cachedApps = null;
    this.cachedPortMap = null;
    if (this.printLog) {
      console.log('🧹 已清除端口管理器缓存');
    }
  }

  /**
   * 获取当前配置信息
   * @returns 配置信息对象
   */
  public getConfig(): { startPort: number; step: number; packagesPath: string } {
    return {
      startPort: this.startPort,
      step: this.step,
      packagesPath: this.packagesPath
    };
  }
}
