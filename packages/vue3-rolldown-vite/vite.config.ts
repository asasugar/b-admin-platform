import { fileURLToPath, URL } from 'node:url';
import { getCurrentFolderName, PortManager } from '@b-admin-platform/build-utils';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

const APP_NAME = getCurrentFolderName(import.meta.url);
// 优先使用端口管理器分配的端口，以便于开发时，多个应用可以同时运行端口不冲突
const port = PortManager.getInstance().getAppPort(APP_NAME) || 5173;

// https://vite.dev/config/
export default defineConfig({
  base: `/${APP_NAME}/`,
  define: {
    'process.env.APP': JSON.stringify(APP_NAME)
  },
  plugins: [vue(), vueJsx(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
