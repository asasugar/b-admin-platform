import { fileURLToPath, URL } from 'node:url';
import { getCurrentFolderName, PortManager } from '@b-admin-platform/build-utils';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import vueDevTools from 'vite-plugin-vue-devtools';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';

const APP_NAME = getCurrentFolderName(import.meta.url);
const port = PortManager.getInstance().getAppPort(APP_NAME) || 5173;

export default defineConfig({
  base: `/${APP_NAME}/`,
  define: {
    'process.env.APP': JSON.stringify(APP_NAME)
  },
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'Icon'
        })
      ],
      dts: 'types/auto-imports.d.ts'
    }),
    Components({
      resolvers: [
        IconsResolver({
          enabledCollections: ['ep']
        }),
        ElementPlusResolver()
      ],
      dts: 'types/components.d.ts'
    }),
    Icons({
      autoInstall: true
    }),
    vueDevTools(),
    vueSetupExtend(),
    viteCompression()
  ],
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
        changeOrigin: true
      }
    }
  }
});