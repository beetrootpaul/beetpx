#!/usr/bin/env sh

# This script is meant to be run from a repository's root directory.

set -e
set -x

npx typedoc \
  --entryPoints src/index.ts \
  --out ./docs/ \
  --includeVersion \
  --plugin @zamiell/typedoc-plugin-not-exported \
  && echo "beetpx.dev" > docs/CNAME
