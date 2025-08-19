import deepmerge from 'deepmerge';
import { defineConfig, type Options } from 'tsup';

export const baseConfig: Options = {
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: true,
  treeshake: true,
  sourcemap: true,
  minify: process.env.NODE_ENV === 'production',
  esbuildOptions(options) {
    // 在开发模式下禁用代码压缩和混淆
    if (process.env.NODE_ENV !== 'production') {
      options.minify = false;
      options.keepNames = true;
    }
  }
};

export function createTsupConfig(config: Options = {}) {
  const options = deepmerge(baseConfig, config, {
    arrayMerge: (_target, sourceArray) => sourceArray
  });
  return defineConfig(options);
}
