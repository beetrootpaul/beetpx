import { expect, test } from "@playwright/test";

test("has default title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("My Best Injected HTML Title");
});
