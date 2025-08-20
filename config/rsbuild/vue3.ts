import { mergeRsbuildConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import { pluginVueJsx } from '@rsbuild/plugin-vue-jsx';
import { getBaseConfig } from './base';
import type { ChildConfigOptions } from './types';

export const getVue3Config = ({ name, port, root }: ChildConfigOptions) => {
  const baseConfig = getBaseConfig({ root, name, port });

  return mergeRsbuildConfig(baseConfig, {
    html: {
      title: name || 'Vue 系统'
    },
    source: {
      entry: {
        index: './src/main.ts'
      }
    },
    plugins: [pluginVue(), pluginVueJsx()]
  });
};
