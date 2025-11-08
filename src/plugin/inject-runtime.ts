import { PluginOption } from "vite";
import * as fs from "fs";
import * as path from "path";

const moduleRoot = path.resolve(__dirname, "../../");

export const createRuntimeInjectPlugin = (): PluginOption => {
  return {
    name: "vite-plugin-assets-retry:inject-runtime",
    apply: "build",
    transformIndexHtml(html) {
      const runtimeCode = [
        fs.readFileSync(
          path.resolve(moduleRoot, "dist/runtime/retry-runtime.umd.js"),
          "utf-8"
        ),
      ].join("\n");
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {},
            injectTo: "head-prepend",
            children: runtimeCode,
          },
        ],
      };
    },
    // generateBundle(options, bundle) {
    //   for (const [fileName, chunk] of Object.entries(bundle)) {
    //     if (chunk.type === "chunk") {
    //       chunk.code = `import "./assets-retry-runtime.js";\n${chunk.code}`;
    //     }
    //   }
    // },
  };
};
