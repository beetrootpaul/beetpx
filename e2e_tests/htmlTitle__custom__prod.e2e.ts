import { expect, test } from "@playwright/test";

test("custom title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("[prod] My Custom HTML Title");
});
