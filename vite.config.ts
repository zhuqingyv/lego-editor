import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'events': path.resolve('./src/Events/index.ts'),
      'const': path.resolve('./src/const/index.ts'),
      'creator': path.resolve('./src/ComponentCreator/index.ts')
    }
  }
})
