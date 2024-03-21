import { expect, test } from "@playwright/test";

// COMMAND ARGS ::

const defaultIconBase64 =
  "iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAAAVdJREFUeJzt3MFNw0AQQFFAdMCRymiCrjlSQyiAPVh5o7Uh/x2jCIevlQd7Y55vnx+3pwfy9vX7te/3+9/34h/psRUQFRAVEL2uXlydQP8z+X1bgaiAqICogKiAqICogKiAqIBoeSXyF61uNR3VlciJCogKiAqItgyR6RP80T2M6c+y0gpEBUQFRAVE40Pk6gNj+hitQFRAVEBUQERDZPqveiGDQLQCUQFRAVEB0eEhsmNgHD2GXGGstCdyogKiAqICosNDZMctpOnPMn3clVYgKiAqICogGt8T2TEw5NZVeyIXU0BUQFRAtOXbWdN7E2dd2ay0AlEBUQFRAdGWPZHpfzWyet9ZT9m3AlEBUQFRAdFpDxtO31Y6SysQFRAVEBUQ0RCRE/yOZzh2aAWiAqICogKi8W9nTf+8Kw2MlVYgKiAqICogWg6RKz1EeHWtQFRAVEBUQPQDHRdHQWx83G0AAAAASUVORK5CYII=";

test("deafult icon", async ({ page }) => {
  await page.goto("/");

  const linkIcon = page.locator('link[rel="icon"]');

  await expect(linkIcon).toHaveAttribute(
    "href",
    `data:image/png;base64,${defaultIconBase64}`,
  );
});
