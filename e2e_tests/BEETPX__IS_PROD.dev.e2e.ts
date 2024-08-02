import { expect, test } from "@playwright/test";

// COMMAND ARGS ::

declare global {
  interface Window {
    BEETPX__IS_PROD: boolean;
  }
  const BEETPX__IS_PROD: boolean;
}

test("is _not_ prod, taken from the `window`", async ({ page }) => {
  await page.goto("./");

  const isProd = await page.evaluate(() => window.BEETPX__IS_PROD);

  expect(isProd).toBe(false);
  expect(typeof isProd).toBe("boolean");
});

test("is _not_ prod, taken from the global namespace", async ({ page }) => {
  await page.goto("./");

  const isProd = await page.evaluate(() => BEETPX__IS_PROD);

  expect(isProd).toBe(false);
  expect(typeof isProd).toBe("boolean");
});
