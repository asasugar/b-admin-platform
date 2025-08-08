import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outExtension: ({ format }) => {
    return {
      js: `.${format}.js`
    };
  },
  clean: true,
  dts: true,
  outDir: 'dist',
  format: ['cjs', 'esm'],
  splitting: true,
  minify: true,
  external: ['axios', 'antd']
});
