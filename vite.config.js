// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@context": path.resolve(__dirname, "./src/context"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@data": path.resolve(__dirname, "./src/data"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
    },
  },
  server: {
    port: 5173,
    open: true,
    host: true,
    cors: true,
  },
  build: {
    outDir: "dist",
    minify: "esbuild",
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          ui: ["framer-motion", "lucide-react", "aos"],
        },
      },
    },
  },
  css: {
    postcss: "./postcss.config.js",
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "framer-motion", "lucide-react", "aos"],
  },
  define: {
    __APP_VERSION__: JSON.stringify("1.0.0"),
    __APP_NAME__: JSON.stringify("Lovely Boutique"),
  },
});
