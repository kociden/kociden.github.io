import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import routeMeta from './scripts/prerender';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), routeMeta()],
  // kociden.github.io（ユーザーページ）はドメイン直下で配信される。
  // /lt/<slug>/ などの深い URL からも同じアセットを読めるよう絶対パスにする
  base: '/',
});
