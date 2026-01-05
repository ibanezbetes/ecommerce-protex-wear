import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps for production
    assetsDir: 'assets',
    cssCodeSplit: false, // Bundle all CSS into one file
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Simplify asset naming
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      },
    },
  },
  base: './', // Use relative paths for assets
  define: {
    global: 'globalThis',
    'process.env': {}, // <--- ESTA ES LA LÍNEA QUE HEMOS AÑADIDO PARA ARREGLAR LA PANTALLA BLANCA
  },
});