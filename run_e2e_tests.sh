#!/usr/bin/env sh

set -e

npx playwright test --config e2e_tests/html_title__default__dev.config.ts
npx playwright test --config e2e_tests/html_title__injected__dev.config.ts
