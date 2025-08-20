import { getCurrentFolderName } from '@b-admin-platform/build-utils';
import { getReactConfig } from '../../config/rsbuild/react';

const APP_NAME = getCurrentFolderName(import.meta.url);

export default getReactConfig({
  name: APP_NAME,
  outputDir: `../../apps/${APP_NAME}`
});
