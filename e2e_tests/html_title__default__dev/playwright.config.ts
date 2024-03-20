import { defineConfig, devices } from "@playwright/test";

// Docs: https://playwright.dev/docs/test-configuration
export default defineConfig({
  testDir: "tests",
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:5173",
    trace: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command:
      "rimraf ./.beetpx/ && rimraf ./public/ && rimraf ./index.html && npm install && npm start",
    url: "http://localhost:5173/index.html",
    reuseExistingServer: false,
  },
});
