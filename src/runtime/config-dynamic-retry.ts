import { withPromiseResolver } from "@/shared/promise-resolver";
import { DYNAMIC_IMPORT_FN_NAME } from "./../shared/constants";
import { RetryOptions } from "./options";

interface IRetryDynamicImportContext {
  /** will be import.meta.url */
  importerUri: string;

  retryPath: string;
}
const dynamicImportRetryFnName = DYNAMIC_IMPORT_FN_NAME;

const startRetry = async (context: IRetryDynamicImportContext) => {
  const { maxRetryCount = 3, domain = [], onRetry } = RetryOptions;
  const { importerUri, retryPath } = context;
  const retryUrl = new URL(retryPath, importerUri);
  const originUrl = retryUrl.toString();
  console.debug("start retry with options: ", RetryOptions);
  console.debug(`start retry for origin url: ${originUrl}`);
  let retryCount = 0;
  const retryDomainList = domain.length === 0 ? [retryUrl.hostname] : domain;
  let retryDomainIdx = 0;

  let lastRetryUrl = originUrl;
  while (retryCount < maxRetryCount) {
    const currentDomain = retryDomainList[retryDomainIdx];
    const newRetryUrl = new URL(lastRetryUrl);
    newRetryUrl.hostname = currentDomain;

    newRetryUrl.searchParams.set("t", `${new Date().getTime()}`);
    newRetryUrl.searchParams.set("r", `${retryCount}`);
    let newRetryUrlStr = newRetryUrl.toString();
    if (typeof onRetry === "function") {
      const replacedUrl = onRetry("import", {
        currentUrl: newRetryUrlStr,
        originalUrl: lastRetryUrl,
      });
      if (replacedUrl) {
        newRetryUrlStr = replacedUrl;
      }
    }
    console.debug(`retry for url with new url: ${newRetryUrlStr}`);
    try {
      return await import(newRetryUrlStr);
    } catch (err) {
      // continue
    }
    lastRetryUrl = newRetryUrlStr;
    retryCount++;
    retryDomainIdx = (retryDomainIdx + 1) % retryDomainList.length;
  }
  throw new Error(`maximum retry count reached for url: ${originUrl}`);
};

const retryDynamicImport = (
  promise: Promise<unknown>,
  context: IRetryDynamicImportContext
) => {
  const {
    promise: retryPromise,
    resolve,
    reject,
  } = withPromiseResolver<unknown>();

  promise.then(resolve).catch(() => {
    startRetry(context).then(resolve).catch(reject);
  });

  return retryPromise;
};
if (!(window as unknown as Record<string, unknown>)[dynamicImportRetryFnName]) {
  (window as unknown as Record<string, unknown>)[dynamicImportRetryFnName] =
    retryDynamicImport;
}

export { retryDynamicImport };
