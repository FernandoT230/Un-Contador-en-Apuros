
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Esto asegura que el juego funcione en cualquier subcarpeta o hosting
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Desactiva los mapas de código para que sea más difícil de ingeniería inversa
  }
});
