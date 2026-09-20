import { expect, test } from "@playwright/test";

// COMMAND ARGS ::

test("default title", async ({ page }) => {
  await page.goto("./");

  await expect(page).toHaveTitle("BeetPx game");
});
