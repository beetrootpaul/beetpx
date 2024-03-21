#!/usr/bin/env node

const fs = require("fs");
const childProcess = require("child_process");

const files = fs.readdirSync(".");

const playwrightConfigFile = "playwright.config.ts";

const devTestFiles = files.filter((f) => f.endsWith(".dev.e2e.ts"));
const prodTestFiles = files.filter((f) => f.endsWith(".prod.e2e.ts"));
const allowedNonTestFiles = [
  ".beetpx",
  ".gitignore",
  "index.html",
  "playwright.config.ts",
  "public",
  "run_e2e_tests.js",
  "some-folder-1",
  "src",
];

const nonTestFile = files.find(
  (f) =>
    !devTestFiles.includes(f) &&
    !prodTestFiles.includes(f) &&
    !allowedNonTestFiles.includes(f),
);
if (nonTestFile) {
  throw Error(
    `File ${nonTestFile} doesn't seems to be named in a format which would allow it to be automatically captured`,
  );
}

devTestFiles.forEach((devTestFile) => {
  runTest(devTestFile, false);
});

prodTestFiles.forEach((prodTestFile) => {
  runTest(prodTestFile, true);
});

////////////////////////////////////////////////////////////////////////////////

function runTest(testFile, isProd) {
  console.log(`\n[e2e] ${testFile} ...\n`);

  if (fs.existsSync(playwrightConfigFile)) {
    fs.rmSync(playwrightConfigFile);
  }

  const commandArgsMarker = "// COMMAND ARGS ::";
  const commandArgsRaw = fs
    .readFileSync(testFile, { encoding: "utf8" })
    .split("\n")
    .filter((line) => line.startsWith(commandArgsMarker));
  if (commandArgsRaw.length <= 0) {
    throw Error(`[e2e] Missing COMMAND ARGS marker in ${testFile}`);
  }
  const commandArgs = commandArgsRaw[0]
    .substring(commandArgsMarker.length)
    .trim();

  const commandArgsSafe = commandArgs.replaceAll('"', '\\"');
  const command = isProd
    ? `../cli/beetpx-cli.cjs build ${commandArgsSafe} && ../cli/beetpx-cli.cjs preview`
    : `../cli/beetpx-cli.cjs dev ${commandArgsSafe}`;

  const url = isProd ? "http://localhost:4173" : "http://localhost:5173";

  fs.writeFileSync(
    playwrightConfigFile,
    `
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testMatch: "${testFile}",
  timeout: 1000,
  reporter: "list",
  quiet: false,
  preserveOutput: "never",
  fullyParallel: false,
  forbidOnly: true,
  webServer: {
    command: "${command}",
    url: "${url}",
    timeout: 5_000,
    stdout: "pipe",
    reuseExistingServer: false,
  },
  use: {
    baseURL: "${url}",
  },
});
  `,
    { encoding: "utf8" },
  );

  const child = childProcess.spawnSync("npx", ["playwright", "test"]);

  console.log(child.stdout?.toString() ?? "");
  console.log(child.stderr?.toString() ?? "");

  if (child.status !== 0) {
    throw Error(`[e2e] Test FAILED for ${testFile}`);
  }
}
