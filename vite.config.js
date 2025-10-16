import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';


export default defineConfig({
  server: {
    host: 'localhost',   // ⬅️ tambahkan ini
    port: 5173,          // ⬅️ pastikan port sesuai
    hmr: {
      host: 'localhost', // ⬅️ tambahkan ini juga
    },
  },
  plugins: [
    laravel({
      input: ['resources/js/app.jsx', 'resources/css/app.css'],
      refresh: true,
    }),
    react(),
  ],
});
