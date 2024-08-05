import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { IncomingMessage, ServerResponse } from 'http';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/user': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/admins': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/post': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:8000', // URL base del servidor
  //       changeOrigin: true,
  //       secure: false,
  //       //rewrite: (path) => path.replace(/^\/api/, ''), // No eliminar '/api' del inicio del path
  //       // onError: (err: Error, req: IncomingMessage, res: ServerResponse) => {
  //       //   console.error('Proxy error:', err);
  //       //   res.writeHead(500, {
  //       //     'Content-Type': 'text/plain',
  //       //   });
  //       //   res.end('Something went wrong. And we are reporting a custom error message.');
  //       // },
  //     },
  //   },
  // },
});
