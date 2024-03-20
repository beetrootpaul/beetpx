import { defineConfig } from "@playwright/test";

// Docs: https://playwright.dev/docs/test-configuration
export default defineConfig({
  testMatch: /.*\.e2e\.ts/,

  timeout: 1000,

  reporter: "list",
  quiet: false,
  preserveOutput: "never",
  fullyParallel: false,

  forbidOnly: true,

  webServer: {
    command:
      '../../cli/beetpx-cli.cjs dev --htmlTitle "My Best Injected HTML Title"',

    url: "http://localhost:5173",
    timeout: 10_000,

    stdout: "pipe",

    reuseExistingServer: false,
  },

  use: {
    baseURL: "http://localhost:5173",
  },
});
