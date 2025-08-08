import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@game': path.resolve(__dirname, 'src/game')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {}
    }
  }
});
