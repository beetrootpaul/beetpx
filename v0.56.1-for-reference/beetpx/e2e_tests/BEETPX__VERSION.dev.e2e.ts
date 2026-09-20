import { expect, test } from "@playwright/test";
import packageJson from "../package.json";

// COMMAND ARGS ::

declare global {
  interface Window {
    BEETPX__VERSION: string;
  }
  const BEETPX__VERSION: string;
}

test("current BeetPx version, taken from the `window`", async ({ page }) => {
  await page.goto("./");

  // First, let's make sure we read the version properly, so we can safely compare to it later on.
  expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+(-fix\d+)?$/);

  const version = await page.evaluate(() => window.BEETPX__VERSION);

  expect(version).toBe(packageJson.version);
  expect(typeof version).toBe("string");
});

test("current BeetPx version, taken from the global namespace", async ({
  page,
}) => {
  await page.goto("./");

  // First, let's make sure we read the version properly, so we can safely compare to it later on.
  expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+(-fix\d+)?$/);

  const version = await page.evaluate(() => BEETPX__VERSION);

  expect(version).toBe(packageJson.version);
  expect(typeof version).toBe("string");
});
