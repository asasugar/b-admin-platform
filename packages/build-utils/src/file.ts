import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * 获取当前文件所在的文件夹名称
 * @param importMetaUrl 调用者的 import.meta.url
 * @returns 当前文件夹名称
 */
export function getCurrentFolderName(importMetaUrl: string): string {
  const __filename = fileURLToPath(importMetaUrl);
  const __dirname = dirname(__filename);
  return path.basename(__dirname);
}
