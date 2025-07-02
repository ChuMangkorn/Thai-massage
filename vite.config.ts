import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-i18next'],
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 3,
        unsafe_arrows: true,
        unsafe_methods: true,
        toplevel: true,
      },
      mangle: {
        safari10: true,
        toplevel: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (_id) => {
          // Core React dependencies - largest chunk, cached most
          if (_id.includes('react') && (_id.includes('react-dom') || _id.includes('react/jsx-runtime'))) {
            return 'react-core';
          }
          // React ecosystem
          if (_id.includes('react') || _id.includes('react-dom')) {
            return 'react-vendor';
          }
          // I18n dependencies
          if (_id.includes('i18next') || _id.includes('react-i18next')) {
            return 'i18n-vendor';
          }
          // UI and utility libraries
          if (_id.includes('lucide-react')) {
            return 'icons';
          }
          if (_id.includes('react-helmet-async')) {
            return 'helmet';
          }
          // Group small utilities together
          if (_id.includes('node_modules')) {
            return 'vendor';
          }
          // App code chunking
          if (_id.includes('src/components/')) {
            return 'components';
          }
          if (_id.includes('src/utils/') || _id.includes('src/hooks/')) {
            return 'utils';
          }
        },
        experimentalMinChunkSize: 10000,
        compact: true,
        inlineDynamicImports: false,
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
        unknownGlobalSideEffects: false,
      },
      external: (_id) => {
        // Don't bundle dev dependencies
        return false;
      },
    },
    reportCompressedSize: false,
    chunkSizeWarningLimit: 500,
    sourcemap: false,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
  },
  // Performance optimizations
  server: {
    hmr: {
      overlay: false
    },
    headers: {
      // Security headers for development
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    }
  }
});
