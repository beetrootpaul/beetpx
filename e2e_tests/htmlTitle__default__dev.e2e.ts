import { expect, test } from "@playwright/test";

test("default title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("BeetPx game");
});
