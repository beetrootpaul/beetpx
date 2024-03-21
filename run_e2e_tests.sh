#!/usr/bin/env sh

set -e

# TODO: run for all e2e files inside that dir instead of listing them one by one here

npx playwright test --config e2e_tests/htmlTitle__custom__dev.config.ts
npx playwright test --config e2e_tests/htmlTitle__custom__prod.config.ts
npx playwright test --config e2e_tests/htmlTitle__default__dev.config.ts
npx playwright test --config e2e_tests/htmlTitle__default__prod.config.ts
