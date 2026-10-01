import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* base relativa: funciona en local y en GitHub Pages */
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "../docs",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "assets/app.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: (info) => {
          if (info.name && info.name.endsWith(".css")) {
            return "assets/estilos.css";
          }
          return "assets/[name][extname]";
        }
      }
    }
  },
  server: {
    host: "127.0.0.1",
    port: 5173
  }
});
