import { expect, test } from "@playwright/test";
import { serveDemo } from "./fixture/serve-demo";

test.describe("测试动态导入重试", () => {
  let testUrl = "";
  let closeDemo: (() => void) | undefined;
  test.beforeAll(async () => {
    const { demoUrl, close, port } = await serveDemo();
    closeDemo = close;
    testUrl = demoUrl;
  });
  test.afterAll(async () => {
    closeDemo?.();
  });
  test("可以进行重试", async ({ page }) => {
    await page.route(
      url => {
        // if (abortedAsync1) return false;
        // abortedAsync1 = true;
        return /async1.*\.js$/.test(url.pathname);
      },
      async route => {
        await route.abort();
      }
    );
    await page.goto(testUrl);
    await page.pause();
    await expect(page.locator("text=async1 loaded")).toBeVisible();
  });
});
