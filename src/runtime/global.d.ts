import type { IConfigRetryOptions } from "./typings";
declare global {
  interface Window {
    $$configAssetsRetry: (config: IConfigRetryOptions) => void;
  }
}

export {};
