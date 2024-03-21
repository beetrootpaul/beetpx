import { defineConfig } from "@playwright/test";
import { configBase } from "./playwright.config.base";

export default defineConfig({
  ...configBase,
  testMatch: "htmlIcon__custom__prod.e2e.ts",
  webServer: {
    ...configBase.webServer,
    command:
      "../cli/beetpx-cli.cjs build --htmlIcon ./some-folder-1/icon_custom.png && ../cli/beetpx-cli.cjs preview",
    url: "http://localhost:4173",
  },
  use: {
    ...configBase.use,
    baseURL: "http://localhost:4173",
  },
});
