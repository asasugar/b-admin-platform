import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: false,
  treeshake: true,
  sourcemap: true,
  minify: process.env.NODE_ENV === 'production',
  external: ['axios', 'qs'],
  noExternal: [],
  esbuildOptions(options) {
    // 在开发模式下禁用代码压缩和混淆
    if (process.env.NODE_ENV !== 'production') {
      options.minify = false;
      options.keepNames = true;
    }
  }
});
