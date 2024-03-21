import { expect, test } from "@playwright/test";

test("custom title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("[dev] My Custom HTML Title");
});
