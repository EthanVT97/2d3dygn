import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@views': path.resolve(__dirname, './src/views'),
      '@store': path.resolve(__dirname, './src/store'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      VITE_API_BASE_URL: JSON.stringify(process.env.VITE_API_BASE_URL || 'https://myanmar-betting-api.onrender.com')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
        }
      }
    }
  },
  // Base URL for production
  base: '/',
  // Copy _redirects file
  publicDir: 'public'
})
