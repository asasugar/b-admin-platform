import { mergeRsbuildConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import type { ChildConfigOptions } from './types';
import { getBaseConfig } from './base';

export const getVue3Config = ({ name, port }: ChildConfigOptions) => {
  const baseConfig = getBaseConfig();

  return mergeRsbuildConfig(baseConfig, {
    html: {
      title: name,
    },
    source: {
      entry: {
        index: './src/main.ts',
      },
    },
    plugins: [
      pluginVue()
    ],
    server: {
      port,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    dev: {
      assetPrefix: `http://localhost:${port}/`,
    },
  });
};
