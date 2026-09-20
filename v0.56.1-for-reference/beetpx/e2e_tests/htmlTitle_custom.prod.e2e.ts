import { expect, test } from "@playwright/test";

// COMMAND ARGS :: --htmlTitle "[prod] My Custom HTML Title"

test("custom title", async ({ page }) => {
  await page.goto("./");

  await expect(page).toHaveTitle("[prod] My Custom HTML Title");
});
