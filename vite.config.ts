import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 4173, // Port par défaut différent de 5173
    strictPort: true, // Force l'utilisation de ce port spécifique
    hmr: {
      overlay: false // Disable HMR overlay to reduce overhead
    },
    watch: {
      usePolling: false // Disable polling
    }
  },
  build: {
    // Optimize build
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', '@radix-ui/react-tabs', '@radix-ui/react-dialog'],
          'utils-vendor': ['date-fns', 'i18next', 'react-i18next', 'zustand']
        }
      }
    }
  }
});