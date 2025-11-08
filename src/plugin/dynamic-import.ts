import { PluginOption } from "vite";
import * as path from "path";
import { DYNAMIC_IMPORT_FN_NAME } from "../shared/constants";

export const createDynamicImportPlugin = (): PluginOption => {
  return {
    name: "vite-plugin-assets-retry:retry-dynamic-import",
    apply: "build",
    renderDynamicImport(options) {
      const { targetModuleId, chunk, targetChunk } = options;
      if (!targetModuleId || !targetChunk) {
        return;
      }
      let relavtivePath = path.normalize(
        path.relative(path.dirname(chunk.fileName), targetChunk.fileName)
      );
      if (!/^(\.|\/)/.test(relavtivePath)) {
        relavtivePath = `./${relavtivePath}`;
      }
      return {
        left: `${DYNAMIC_IMPORT_FN_NAME}(import(`,
        right: `), {importerUri: import.meta.url, retryPath: ${JSON.stringify(
          relavtivePath
        )}})`,
      };
    },
  };
};
