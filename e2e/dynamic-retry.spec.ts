import { expect, Page, test } from "@playwright/test";
import { serveDemo } from "./fixture/serve-demo";

test.describe.configure({
  mode: "serial",
});

test.describe("测试动态导入重试", () => {
  let testUrl = "";
  let closeDemo: (() => void) | undefined;
  let port: number;

  test.beforeEach(async () => {
    const { demoUrl, close, port: demoPort } = await serveDemo();
    closeDemo = close;
    testUrl = demoUrl;
    port = demoPort;
  });

  test.afterEach(async () => {
    closeDemo?.();
  });

  [
    {
      regexp: /index.*\.js$/,
      name: "入口js可以进行重试",
      assertFn: async (page: Page) => {
        await expect(page.locator("text=entry loaded")).toBeVisible();
      },
    },
    {
      regexp: /async1.*\.js$/,
      name: "异步加载js可以进行重试",
      assertFn: async (page: Page) => {
        await expect(page.locator("text=async1 loaded")).toBeVisible();
      },
    },
  ].forEach(({ regexp, name, assertFn }) => {
    test(name, async ({ page }) => {
      const failureMap = new Map<string, boolean>();
      await page.route(
        url => {
          if (
            url.hostname.includes("localhost") &&
            regexp.test(url.pathname) &&
            !failureMap.get(url.pathname)
          )
            return true;
          return false;
        },
        async route => {
          await route.abort();
        }
      );

      await page.route(
        url => {
          return url.hostname.includes("b.com") && regexp.test(url.pathname);
        },
        async route => {
          failureMap.set(new URL(route.request().url()).pathname, true);
          // 将b.com的请求代理到localhost的端口
          const originalUrl = route.request().url();
          const newUrl = originalUrl.replace("b.com", `localhost:${port}`);
          console.log(">>>[proxy]", originalUrl, newUrl);
          await route.continue({ url: newUrl });
        }
      );

      // 添加网络事件监听
      page.on("request", request => {
        console.log(">>", request.method(), request.url());
      });
      page.on("requestfailed", request => {
        console.log("<<<[requestfailed]", request.method(), request.url());
      });
      page.on("response", response => {
        console.log("<<[response]", response.status(), response.url());
      });
      page.on("console", msg => {
        console.log(`[${msg.type()}] - ${msg.text()}`);
      });

      await page.goto(testUrl);
      await assertFn(page);
      await page.close({
        runBeforeUnload: true,
      });
    });
  });
});
