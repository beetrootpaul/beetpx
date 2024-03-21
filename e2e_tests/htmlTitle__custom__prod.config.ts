import { defineConfig } from "@playwright/test";
import { configBase } from "./playwright.config.base";

export default defineConfig({
  ...configBase,
  testMatch: "htmlTitle__custom__prod.e2e.ts",
  webServer: {
    ...configBase.webServer,
    command:
      '../cli/beetpx-cli.cjs build --htmlTitle "[prod] My Custom HTML Title" && ../cli/beetpx-cli.cjs preview',
    url: "http://localhost:4173",
  },
  use: {
    ...configBase.use,
    baseURL: "http://localhost:4173",
  },
});
