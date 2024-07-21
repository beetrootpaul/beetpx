#!/usr/bin/env sh

# This script is meant to be run from a repository's root directory.

set -e
set -x

npx typedoc \
  --entryPoints src/index.ts \
  --includeVersion \
  --out ./docs/ \
  --cname "beetpx.dev" \
  --plugin @zamiell/typedoc-plugin-not-exported

