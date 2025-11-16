import path from "path";
import { defineConfig } from "vite";
import retryPlugin from "./src/plugin";
import * as fs from "fs";

export default defineConfig({
  base: "./",
  build: {
    minify: false,
    outDir: "./demo-dist",
  },
  plugins: [
    retryPlugin(),
    {
      name: "copy-sourcemap",
      apply: "build",
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "assets-retry.umd.js.map",
          source: fs.readFileSync(
            path.resolve(
              __dirname,
              "node_modules/assets-retry/dist/assets-retry.umd.js.map"
            )
          ),
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@@": path.resolve(__dirname),
    },
  },
});
