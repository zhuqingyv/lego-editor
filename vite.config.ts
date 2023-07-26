import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080
  },
  plugins: [
    react(),
    cssInjectedByJsPlugin()
  ],
  resolve: {
    alias: {
      'events': path.resolve('./src/Lego/base/Events/index.ts'),
      'const': path.resolve('./src/Lego/const/index.ts'),
      'creator': path.resolve('./src/Lego/base/ComponentCreator/index.ts'),
      '@service': path.resolve('./src/common/service.js'),
      'lib': path.resolve('./src/common/lib.js'),
      'toast': path.resolve('./src/Lego/Toast/index.tsx')
    }
  },
  define: {
    'process.env': {}
  }
})
