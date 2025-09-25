/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import retryPlugin from "./src";

export default defineConfig({
  base: "./",
  test: {
    watch: false,
  },
  build: {
    minify: false,
    outDir: "./demo-dist",
  },
  plugins: [retryPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@@": path.resolve(__dirname),
    },
  },
});
