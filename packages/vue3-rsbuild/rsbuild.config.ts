import { getCurrentFolderName } from '@b-admin-platform/build-utils';
import { mergeRsbuildConfig } from '@rsbuild/core';
import AutoImport from 'unplugin-auto-import/rspack';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/rspack';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/rspack';
import { getVue3Config } from '../../config/rsbuild/vue3';

const APP_NAME = getCurrentFolderName(import.meta.url);

export default mergeRsbuildConfig(
  getVue3Config({
    name: APP_NAME,
    outputDir: `../../apps/${APP_NAME}`
  }),
  {
    tools: {
      rspack: {
        plugins: [
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
          })
        ]
      }
    }
  }
);
