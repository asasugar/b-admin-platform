import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// 在 ESM 中模拟 __dirname
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// 前端应用目录 - 指向根目录的 apps 文件夹
export const appsPath = path.join(__dirname, '../../../../apps');
// packages目录路径
export const packagesPath = path.join(__dirname, '../../../../packages');

// 默认404页面路径
export const default404Path = path.join(__dirname, '../../public/index.html');
