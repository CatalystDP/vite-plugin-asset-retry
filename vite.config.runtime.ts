import path from "path";
import * as fs from "fs";
import { defineConfig } from "vite";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dts from "unplugin-dts/vite";

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
    lib: {
      entry: path.resolve(__dirname, "src/runtime/index.ts"),
      //   name: getPackageNameCamelCase(),
      name: "$$configAssetsRetry",
      formats,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fileName: baseName,
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@@": path.resolve(__dirname),
    },
  },
  plugins: [
    dts({
      tsconfigPath: path.join(__dirname, "./tsconfig.dts-runtime.json"),
      outDir: "dist/runtime",
      copyDtsFiles: true,
      beforeWriteFile: (filePath: string) => {
        const allowFiles = ["runtime", "typings"];
        const prefix = "src/runtime";
        if (allowFiles.some(file => filePath.includes(`${prefix}/${file}`))) {
          return {
            filePath: filePath.replace("src/runtime", ""),
          };
        }
        return false;
      },
    }),
    {
      name: "copy-dts",
      apply: "build",
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: `runtime.d.ts`,
          source: fs.readFileSync(
            path.resolve(__dirname, "src/runtime/runtime.d.ts")
          ),
        });
      },
    },
  ],
});
