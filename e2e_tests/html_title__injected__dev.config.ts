import { defineConfig } from "@playwright/test";
import { configBase } from "./playwright.config.base";

export default defineConfig({
  ...configBase,
  testMatch: "html_title__injected__dev.e2e.ts",
  webServer: {
    ...configBase.webServer,
    command:
      '../cli/beetpx-cli.cjs dev --htmlTitle "My Best Injected HTML Title"',
  },
});
