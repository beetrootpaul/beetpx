import { defineConfig } from "@playwright/test";
import { configBase } from "./playwright.config.base";

export default defineConfig({
  ...configBase,
  testMatch: "htmlTitle__custom__dev.e2e.ts",
  webServer: {
    ...configBase.webServer,
    command:
      '../cli/beetpx-cli.cjs dev --htmlTitle "[dev] My Custom HTML Title"',
    url: "http://localhost:5173",
  },
  use: {
    ...configBase.use,
    baseURL: "http://localhost:5173",
  },
});
