import { defineConfig } from 'vite';

// フォントの woff 版を落とす。Android の WebView は woff2 を読めるので、
// 同梱するファイルサイズが半分以下になる。
const woff2Only = {
 name: 'woff2-only',
 enforce: 'pre',
 transform(code, id) {
  if (id.includes('@fontsource') && id.includes('.css'))
   return code.replace(/,\s*url\([^)]+\.woff\)\s*format\('woff'\)/g, '');
 },
};

export default defineConfig({
 // WebView は localhost 配信なので、アセットは相対パスで参照する。
 base: './',
 plugins: [woff2Only],
 build: { rollupOptions: { output: { manualChunks(id) { if(id.includes('node_modules/three/'))return 'three'; } } } },
});
