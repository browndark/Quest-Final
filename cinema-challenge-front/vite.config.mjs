// vite.config.mjs - ESM version of the config
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './', // Set the root to the current directory where index.html is located
  build: {
    outDir: 'dist',
  },  server: {
    port: 3002, // Frontend runs on 3002
    strictPort: true, // Don't try other ports if 3002 is in use
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // API runs on 3000
        changeOrigin: true,
        secure: false,
        // Keeping the /api prefix for API calls
        // The backend expects /api/v1 for routes, which is configured in our axios instance
      },
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /\.[jt]sx?$/,  // .ts, .tsx, .js, .jsx
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});
