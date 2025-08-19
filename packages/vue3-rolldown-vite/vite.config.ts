import { fileURLToPath, URL } from 'node:url';
import { getCurrentFolderName } from '@b-admin-platform/build-utils';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

const APP_NAME = getCurrentFolderName(import.meta.url);
console.log('%c [ APP_NAME ]-9', 'font-size:13px; background:pink; color:#bf2c9f;', APP_NAME);

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
