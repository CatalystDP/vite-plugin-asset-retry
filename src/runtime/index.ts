import { RetryOptions } from "./options";
import { IConfigRetryOptions } from "./typings";
import { retryDynamicImport } from "./config-dynamic-retry";

interface IConfigRetry {
  (options?: IConfigRetryOptions): void;
  retryDynamicImport: typeof retryDynamicImport;
}

const configRetry: IConfigRetry = (options?: IConfigRetryOptions) => {
  Object.assign(RetryOptions, options);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any)?.assetsRetry?.({
    domain: RetryOptions.domain,
    maxRetryCount: RetryOptions.maxRetryCount || 3,
    ...(typeof RetryOptions?.onRetry === "function"
      ? {
          onRetry: function (currentUrl: string, originalUrl: string) {
            return RetryOptions.onRetry?.("script", {
              currentUrl,
              originalUrl,
            });
          },
        }
      : null),

    onSuccess: function (currentUrl: string) {
      RetryOptions.onSuccess?.("script", {
        currentUrl,
      });
    },
    onFail: function (currentUrl: string) {
      RetryOptions.onFail?.("script", {
        currentUrl,
      });
    },
  });
};
configRetry.retryDynamicImport = retryDynamicImport;

export * from "./typings";

export default configRetry;
