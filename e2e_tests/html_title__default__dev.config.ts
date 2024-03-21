import { defineConfig } from "@playwright/test";
import { configBase } from "./playwright.config.base";

export default defineConfig({
  ...configBase,
  testMatch: "html_title__default__dev.e2e.ts",
  webServer: {
    ...configBase.webServer,
    command: "../cli/beetpx-cli.cjs dev",
  },
});
