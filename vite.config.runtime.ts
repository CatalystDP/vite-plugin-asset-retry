import path from "path";
import { defineConfig } from "vite";

const baseName = "retry-runtime";

const fileNames = {
  umd: `${baseName}.umd.js`,
};

const formats = Object.keys(fileNames) as Array<keyof typeof fileNames>;

export default defineConfig({
  base: "./",
  build: {
    emptyOutDir: true,
    outDir: "./dist/runtime",
    rollupOptions: {
      output: {
        exports: "named",
      },
    },
    lib: {
      entry: path.resolve(__dirname, "src/runtime/index.ts"),
      //   name: getPackageNameCamelCase(),
      name: "$$configAssetsRetry",
      formats,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fileName: format => fileNames[format],
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@@": path.resolve(__dirname),
    },
  },
});
