import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { generateFrontendIndexHtml, PortManager } from '@b-admin-platform/build-utils';
import { defineConfig } from '@rsbuild/core';
import { pluginLess } from '@rsbuild/plugin-less';
import type { ChildConfigOptions } from './types';

export const getBaseConfig = ({ outputDir, name, port }: ChildConfigOptions) => {
  // 优先使用端口管理器分配的端口，以便于开发时，多个应用可以同时运行端口不冲突
  port = PortManager.getInstance().getAppPort(name) || port;
  const root = getOutputDir(outputDir);

  return defineConfig({
    server: {
      base: `/${name}`,
      port,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      // 前端代理后端接口：前端请求 localhost:8000/api/proxy/myWebsite/formily/query 代理到后端（localhost:3000/api/proxy/myWebsite/formily/query）
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      }
    },
    dev: {
      assetPrefix: `http://localhost:${port}/${name}`
    },
    plugins: [pluginLess()],
    html: {
      // 通过 tools.htmlPlugin 来配置动态模板
    },
    output: {
      cleanDistPath: true,
      distPath: {
        root
      },
      copy: [
        {
          from: path.resolve(process.cwd(), '../../packages/backend/public/healthCheck.html'),
          to: '.'
        }
      ]
    },
    source: {
      entry: {
        index: './src/main.ts'
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.APP': JSON.stringify(name)
      }
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.vue', '.js', '.jsx'],
      alias: {
        '@': fileURLToPath(new URL(path.resolve(process.cwd(), './src'), import.meta.url))
      }
    },
    tools: {
      cssLoader: {
        modules: {
          auto: true
        }
      },
      postcss: (_config, { addPlugins }) => {
        addPlugins([require('@tailwindcss/postcss')]);
      },
      htmlPlugin: {
        // 使用 templateContent 而不是 template 文件
        templateContent: generateFrontendIndexHtml,
        inject: true
      }
    }
  });
};

/**
 * 获取输出目录
 * @param root 根目录
 * @returns 输出目录
 */
function getOutputDir(root: string) {
  const fs = require('node:fs');
  const path = require('node:path');

  const outputDir = path.resolve(process.cwd(), root);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`✅ Auto-created output directory: ${outputDir}`);
  }
  return outputDir;
}
