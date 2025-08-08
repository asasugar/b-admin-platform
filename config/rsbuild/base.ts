
import path from 'node:path';
import { generateFrontendIndexHtml } from '@b-admin-platform/build-utils';
import { defineConfig } from '@rsbuild/core';
import { pluginLess } from '@rsbuild/plugin-less';

export const getBaseConfig = () => {
  return defineConfig({
    plugins: [pluginLess()],
    html: {
      // 通过 tools.htmlPlugin 来配置动态模板
    },
    output: {
      cleanDistPath: true,
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
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.vue', '.js', '.jsx']
    },
    tools: {
      cssLoader: {
        modules: {
          auto: true
        }
      },
      postcss: (_config, { addPlugins }) => {
        addPlugins([
          require('@tailwindcss/postcss'),
        ]);
      },
      htmlPlugin: {
        // 使用 templateContent 而不是 template 文件
        templateContent: generateFrontendIndexHtml,
        inject: true,
      }
    }
  });
};
