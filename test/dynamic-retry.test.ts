import { beforeEach, describe, expect, it, vi } from "vitest";
import configRetry, { IConfigRetryOptions } from "../src/runtime";

describe("import() retry test suite", () => {
  beforeEach(async () => {
    configRetry({
      maxRetryCount: 3,
      domain: ["b.com", "c.com", "d.com", "a.com"],
    });
  });
  it("change domain retry", async () => {
    let err: Error | undefined;
    const spyRetry = vi.fn();
    configRetry({
      onRetry: spyRetry,
    });
    try {
      await configRetry.retryDynamicImport(
        Promise.reject(new Error("test error")),
        {
          importerUri: "https://a.com/test.js",
          retryPath: "./test1.js",
        }
      );
    } catch (e) {
      err = e as Error;
    }
    expect(err).toBeDefined();
    expect(spyRetry).toBeCalledTimes(3);
    const calls = spyRetry.mock.calls;
    const callArgs: Parameters<Required<IConfigRetryOptions>["onRetry"]>[] = [
      [
        "import",
        {
          currentUrl: "https://b.com/test1.js",
          originalUrl: "https://a.com/test1.js",
        },
      ],
      [
        "import",
        {
          currentUrl: "https://c.com/test1.js",
          originalUrl: "https://b.com/test1.js",
        },
      ],
      [
        "import",
        {
          currentUrl: "https://d.com/test1.js",
          originalUrl: "https://c.com/test1.js",
        },
      ],
    ];
    calls.forEach((call, index) => {
      expect(call[0]).toContain(callArgs[index][0]);
      expect(call[1].currentUrl).toContain(callArgs[index][1].currentUrl);
      expect(call[1].originalUrl).toContain(callArgs[index][1].originalUrl);
    });
  });
});
