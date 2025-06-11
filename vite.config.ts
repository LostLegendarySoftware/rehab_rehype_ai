import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['tone', 'wavesurfer.js']
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'audio-processing': ['tone', 'wavesurfer.js'],
          'ui-components': ['framer-motion', 'react-dropzone'],
          'vendor': ['react', 'react-dom', 'zustand']
        }
      }
    }
  }
});