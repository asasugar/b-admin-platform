import { mergeRsbuildConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { getBaseConfig } from './base';
import type { ChildConfigOptions } from './types';
export const getReactConfig = ({ name, root, port }: ChildConfigOptions) => {
  const baseConfig = getBaseConfig({ root, name, port });

  return mergeRsbuildConfig(baseConfig, {
    html: {
      title: name || 'React 系统'
    },
    source: {
      entry: {
        index: './src/main.tsx'
      }
    },
    plugins: [
      pluginReact({
        swcReactOptions: {
          runtime: 'automatic',
          importSource: 'react'
        }
      })
    ]
  });
};
