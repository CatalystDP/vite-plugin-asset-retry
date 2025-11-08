import { PluginOption } from "vite";
import { createRuntimeInjectPlugin } from "./inject-runtime";
import { createDynamicImportPlugin } from "./dynamic-import";

export default () => {
  const plugins: PluginOption[] = [
    createDynamicImportPlugin(),
    createRuntimeInjectPlugin(),
  ];
  return plugins;
};
