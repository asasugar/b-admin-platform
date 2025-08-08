import { execSync } from 'node:child_process';
import { PortManager } from '@b-admin-platform/build-utils';

function killPort(type: 'Backend' | 'Frontend', port: number): void {
	try {
		// 对于 macOS 和 Linux
		if (process.platform === 'darwin' || process.platform === 'linux') {
			execSync(`lsof -i :${port} | grep LISTEN | awk '{print $2}' | xargs kill -9`);
		}
		// 对于 Windows
		else if (process.platform === 'win32') {
			execSync(
				`netstat -ano | findstr :${port} | findstr LISTENING && FOR /F "tokens=5" %a in ('netstat -ano | findstr :${port} | findstr LISTENING') do taskkill /F /PID %a`
			);
		}
		console.log(`${type}: Successfully killed process on port ${port}`);
	} catch (_error) {
		// 如果没有找到进程，也不报错
		console.log(`${type}: No process found on port ${port}`);
	}
}

function main(): void {
		const backendPort = Number(process.env.BACKEND_PORT) || 3000;
  // 关闭后端端口
  killPort('Backend', backendPort);

  // 关闭本地前端端口
  const ports = PortManager.getInstance({ printLog: false }).getAllPorts();
  Object.values(ports).forEach((port: number) => {
    killPort('Frontend', port);
  });
  console.log('🔄 已关闭所有 Node 端口');
}

main();
