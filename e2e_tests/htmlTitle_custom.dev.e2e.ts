import { expect, test } from "@playwright/test";

// COMMAND ARGS :: --htmlTitle "[dev] My Custom HTML Title"

test("custom title", async ({ page }) => {
  await page.goto("./");

  await expect(page).toHaveTitle("[dev] My Custom HTML Title");
});
