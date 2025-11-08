/**
 * load type
 * when url is using static script tag or dynamic create script tag the type is script
 * when url is using import() type is import
 */
export type IJSLoadType = "script" | "import";

export interface OnRetryCallbackContext {
  currentUrl: string;
  originalUrl: string;
}

export interface OnSuccessCallbackContext {
  currentUrl: string;
}

export type OnFailCallbackContext = OnSuccessCallbackContext;

export interface IConfigRetryOptions {
  /**
   * need retry domain list
   */
  domain?: string[];

  /**
   * an assets max retry count
   * default is 3
   */
  maxRetryCount?: number;

  /**
   * when retry, could be used to reconstrut url
   */
  onRetry?: (
    type: IJSLoadType,
    context: OnRetryCallbackContext
  ) => string | null;

  /**
   * final load success url
   */
  onSuccess?: (type: IJSLoadType, context: OnSuccessCallbackContext) => void;

  /**
   * final load fail url
   */
  onFail?: (type: IJSLoadType, context: OnFailCallbackContext) => void;
}
