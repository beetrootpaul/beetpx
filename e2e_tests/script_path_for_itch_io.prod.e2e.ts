import { expect, test } from "@playwright/test";

// COMMAND ARGS ::

test("script tag should start with `./`, as it apparently is needed for BeetPx games to work correctly on itch.io", async ({
  page,
}) => {
  await page.goto("/");

  const scriptTag = page.locator('script[type="module"]');

  await expect(scriptTag).toHaveAttribute("src", /^\.\/assets\/index-/);
});
