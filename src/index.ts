import { createDynamicImportPlugin } from "./dynamic-import";
import { PluginOption } from "vite";

export default () => {
  const plugins: PluginOption[] = [createDynamicImportPlugin()];
  return plugins;
};
