import { defineConfig } from "vitest/config";
import * as path from "path";

export default defineConfig({
  test: {
    dir: path.join(__dirname, "./test"),
    environment: "jsdom",
    alias: {
      "@": path.join(__dirname, "./src"),
    },
    globals: true,
  },
});
