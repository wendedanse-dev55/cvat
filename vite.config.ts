// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import path from "path";
export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),

    }
  }
});
