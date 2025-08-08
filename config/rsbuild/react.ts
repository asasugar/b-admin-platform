import { PortManager } from '@b-admin-platform/build-utils';
import { mergeRsbuildConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { getBaseConfig } from './base';
import type { ChildConfigOptions } from './types';
export const getReactConfig = ({ name, root, port }: ChildConfigOptions) => {
  // 优先使用端口管理器分配的端口，以便于开发时，多个应用可以同时运行端口不冲突
  port = PortManager.getInstance().getAppPort(name) || port;
  const baseConfig = getBaseConfig();

  // 自动创建输出目录
  const fs = require('node:fs');
  const path = require('node:path');

  const outputDir = path.resolve(process.cwd(), root);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`✅ Auto-created output directory: ${outputDir}`);
  }
  return mergeRsbuildConfig(baseConfig, {
    output: {
      distPath: {
        root: outputDir
      }
    },
    html: {
      title: name || '营销系统'
    },
    source: {
      entry: {
        index: './src/main.tsx'
      },
      define: {
        'process.env.APP': JSON.stringify(name)
      }
    },
    plugins: [
      pluginReact({
        swcReactOptions: {
          runtime: 'automatic',
          importSource: 'react'
        }
      })
    ],
    server: {
      base: `/${name}`,
      port,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      }
    },
    dev: {
      assetPrefix: `http://localhost:${port}/${name}`
    }
  });
};
