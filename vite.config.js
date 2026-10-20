import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function expressPlugin() {
  return {
    name: 'express-middleware',
    async configureServer(server) {
      // Mount the real Express app into Vite's connect middleware only in dev mode
      const { app: expressApp } = await import('./server/app.js');
      server.middlewares.use(expressApp);
    },
  };
}

export default defineConfig({
  plugins: [react(), expressPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'gsap-vendor': ['gsap', '@gsap/react'],
        },
      },
    },
  },
});
