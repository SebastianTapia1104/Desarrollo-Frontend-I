import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* base relativa: funciona en local y en GitHub Pages */
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "docs"
  },
  server: {
    host: "127.0.0.1",
    port: 5173
  }
});
