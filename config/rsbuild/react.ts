import { mergeRsbuildConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { getBaseConfig } from './base';
import type { ChildConfigOptions } from './types';
export const getReactConfig = ({ name, outputDir, port }: ChildConfigOptions) => {
  const baseConfig = getBaseConfig({ outputDir, name, port });

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
