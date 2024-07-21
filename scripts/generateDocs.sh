#!/usr/bin/env sh

# This script is meant to be run from a repository's root directory.

set -e
set -x

BEETPX_VERSION="$(node -p -e "require('./package.json').version")"

npx typedoc \
  --entryPoints src/index.ts \
  --exclude ".nvmrc" \
  --includeVersion \
  --lang en \
  --basePath "./docs/${BEETPX_VERSION}" \
  --hostedBaseUrl "https://beetpx.dev/docs/${BEETPX_VERSION}" \
  --out "./docs/docs/${BEETPX_VERSION}" \
  --cleanOutputDir true \
  --githubPages true \
  --treatWarningsAsErrors \
  --plugin @zamiell/typedoc-plugin-not-exported
