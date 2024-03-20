#!/usr/bin/env sh

npx playwright test --config e2e_tests/html_title__default__dev/playwright.config.ts
npx playwright test --config e2e_tests/html_title__injected__dev/playwright.config.ts

