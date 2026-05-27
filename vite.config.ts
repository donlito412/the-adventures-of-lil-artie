import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@input': path.resolve(__dirname, './src/input'),
      '@player': path.resolve(__dirname, './src/player'),
      '@weapons': path.resolve(__dirname, './src/weapons'),
      '@enemies': path.resolve(__dirname, './src/enemies'),
      '@world': path.resolve(__dirname, './src/world'),
      '@traversal': path.resolve(__dirname, './src/traversal'),
      '@quests': path.resolve(__dirname, './src/quests'),
      '@dialogue': path.resolve(__dirname, './src/dialogue'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@audio': path.resolve(__dirname, './src/audio'),
      '@data': path.resolve(__dirname, './src/data'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          babylon: ['@babylonjs/core'],
          babylonGui: ['@babylonjs/gui'],
          babylonLoaders: ['@babylonjs/loaders'],
        },
      },
    },
  },
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr', '**/*.env'],
});
