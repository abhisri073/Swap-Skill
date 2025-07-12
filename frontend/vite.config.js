import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  // Setup proxy to forward API requests to the backend (running on port 5000)
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Ensure this matches your backend server port
        changeOrigin: true,
        secure: false,
      },
    },
    port: 3000, // Frontend port
  },
});