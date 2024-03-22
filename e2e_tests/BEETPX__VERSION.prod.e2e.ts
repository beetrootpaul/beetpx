import { expect, test } from "@playwright/test";
import packageJson from "../package.json";

// COMMAND ARGS ::

declare global {
  interface Window {
    BEETPX__VERSION: boolean;
  }
}

test("current BeetPx version", async ({ page }) => {
  await page.goto("/");

  // First, let's make sure we read the version properly, so we can safely compare to it later on.
  expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+$/);

  expect(await page.evaluate(() => window.BEETPX__VERSION)).toBe(packageJson.version);
});
