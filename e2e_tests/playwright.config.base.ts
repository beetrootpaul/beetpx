import { type PlaywrightTestConfig } from "@playwright/test";

// Docs: https://playwright.dev/docs/test-configuration
export const configBase: PlaywrightTestConfig = {
  timeout: 1000,

  reporter: "list",
  quiet: false,
  preserveOutput: "never",
  fullyParallel: false,

  forbidOnly: true,

  webServer: {
    command: 'echo "pls define the command for each test separately"',

    url: "http://localhost:5173",
    timeout: 10_000,

    stdout: "pipe",

    reuseExistingServer: false,
  },

  use: {
    baseURL: "http://localhost:5173",
  },
};
