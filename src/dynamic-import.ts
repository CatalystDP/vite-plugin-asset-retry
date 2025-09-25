import { PluginOption } from "vite";
import * as path from "path";

export const createDynamicImportPlugin = (): PluginOption => {
  return {
    name: "retry-dynamic-import",
    renderDynamicImport(options) {
      const { moduleId, targetModuleId, chunk, targetChunk } = options;
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
        left: `__dynamicRetry(import(`,
        right: `), {importerUri: import.meta.url, targetRelativePath: ${JSON.stringify(
          relavtivePath
        )}})`,
      };
    },
  };
};
