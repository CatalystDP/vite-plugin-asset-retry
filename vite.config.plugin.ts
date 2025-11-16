import path from "path";
import { defineConfig } from "vite";
import { builtinModules } from "node:module";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dts from "unplugin-dts/vite";

const NODE_BUILT_IN_MODULES = builtinModules.filter(m => !m.startsWith("_"));
NODE_BUILT_IN_MODULES.push(...NODE_BUILT_IN_MODULES.map(m => `node:${m}`));

const fileName = {
  es: `index.mjs`,
  cjs: `index.cjs`,
};

const formats = Object.keys(fileName) as Array<keyof typeof fileName>;

export default defineConfig({
  base: "./",
  build: {
    emptyOutDir: true,
    outDir: "./dist/plugin",
    lib: {
      entry: path.resolve(__dirname, "src/plugin/index.ts"),
      name: "index",
      formats,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fileName: format => fileName[format],
    },
    minify: false,
    rollupOptions: {
      external: NODE_BUILT_IN_MODULES,
    },
  },
  plugins: [
    dts({
      tsconfigPath: path.join(__dirname, "./tsconfig.dts-plugin.json"),
      outDir: "dist/plugin",
      beforeWriteFile: (filePath: string) => {
        if (filePath.includes("/plugin/plugin")) {
          return {
            filePath: filePath.replace("/plugin/plugin", "/plugin"),
          };
        }
      },
    }),
  ],
  optimizeDeps: {
    exclude: NODE_BUILT_IN_MODULES,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@@": path.resolve(__dirname),
    },
  },
});
