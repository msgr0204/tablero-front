import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Usar import en lugar de require

// Importar Tailwind CSS y Autoprefixer como plugins
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Mantiene los assets absolutos al recargar rutas de React Router.
  resolve: {
    alias: {
      '@assets': '/src/assets', // Alias para acceder a recursos de manera más sencilla
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer], // Aquí utilizamos las importaciones
    },
  },
  server: {
    host: true, // Esto permite que Vite use tu dirección IP en lugar de localhost
    port: 5200, // (Modificar) Puerto
  },
});
