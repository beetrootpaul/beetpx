import { defineConfig } from "@playwright/test";
import { configBase } from "./playwright.config.base";

export default defineConfig({
  ...configBase,
  testMatch: "htmlIcon__custom__dev.e2e.ts",
  webServer: {
    ...configBase.webServer,
    command:
      "../cli/beetpx-cli.cjs dev --htmlIcon ./some-folder-1/icon_custom.png",
    url: "http://localhost:5173",
  },
  use: {
    ...configBase.use,
    baseURL: "http://localhost:5173",
  },
});
