import { expect, test } from "@playwright/test";

const customIconBase64 =
  "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADpJREFUOI1jMNV2+m+q7fSfgUzARK7GUQMGpQHkpgUUF5BjCCMuTaev7mOkyABiDSXJAGxgEEUjuQAAjAAQQYkrI3IAAAAASUVORK5CYII=";

test("custom icon", async ({ page }) => {
  await page.goto("/");

  const linkIcon = page.locator('link[rel="icon"]');

  await expect(linkIcon).toHaveAttribute(
    "href",
    `data:image/png;base64,${customIconBase64}`,
  );
});
