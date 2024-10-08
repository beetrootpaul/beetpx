#!/usr/bin/env sh

# This script is meant to be run from a repository's root directory.

set -e
set -x

npm install

BEETPX_VERSION="$(node -p -e "require('./package.json').version")"

#
# Docs
#

echo "Generating the docs ..."

# --alwaysCreateEntryPointModule - Somehow adding a separate navigation level for the module makes the globals (e.g. `BEETPX__IS_PROD`) added to docs.
npx typedoc \
  --entryPoints src/index.ts \
  --lang en \
  --alwaysCreateEntryPointModule \
  --includeVersion \
  --titleLink "https://beetpx.dev" \
  --basePath "./docs/${BEETPX_VERSION}" \
  --hostedBaseUrl "https://beetpx.dev/docs/${BEETPX_VERSION}" \
  --sort static-first --sort alphabetical \
  --out "./docs/docs/${BEETPX_VERSION}" \
  --cleanOutputDir true \
  --githubPages true \
  --plugin @zamiell/typedoc-plugin-not-exported \
  --plugin typedoc-plugin-extras \
  --footerDate

#
# Main page
#

echo "Generating the main page ..."

cp ./docs/index.template.html ./docs/index.html
npx replace-in-file "/__BEETPX_VERSION__/g" "${BEETPX_VERSION}" ./docs/index.html

cp ./docs/robots.template.txt ./docs/robots.txt
npx replace-in-file "/__BEETPX_VERSION__/g" "${BEETPX_VERSION}" ./docs/robots.txt
