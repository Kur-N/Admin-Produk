import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Ketika browser Anda meminta '/api/v1/files/*',
      // Vite akan meneruskan permintaan ini ke 'https://api.escuelajs.co/api/v1/files/*'
      '/api/v1/files': {
        target: 'https://api.escuelajs.co',
        changeOrigin: true, // Penting untuk hosting virtual
        // pathRewrite: { '^/api/v1/files': '/api/v1/files' } // Tidak perlu jika path sama
      }
    }
  }
});