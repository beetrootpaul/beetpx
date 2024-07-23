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

npx typedoc \
  --entryPoints src/index.ts \
  --lang en \
  --titleLink "https://beetpx.dev" \
  --basePath "./docs/${BEETPX_VERSION}" \
  --hostedBaseUrl "https://beetpx.dev/docs/${BEETPX_VERSION}" \
  --out "./docs/docs/${BEETPX_VERSION}" \
  --cleanOutputDir true \
  --githubPages true \
  --plugin @zamiell/typedoc-plugin-not-exported

#
# Examples
#

for EXAMPLE_PROJECT in ./examples/*/
do
  echo "Building example project: ${EXAMPLE_PROJECT} ..."
  cd $EXAMPLE_PROJECT
  npm install
  npm run tsc
  npm run test --if-present
  npm run build
  mkdir -p ../../docs/examples/canvas-snapshot/
  cp -R ./.beetpx/dist/ "../../docs/$EXAMPLE_PROJECT"
  cd ../../
done

#
# Main page
#

echo "Generating the main page ..."

cp ./docs/index.template.html ./docs/index.html
cp ./docs/robots.template.txt ./docs/robots.txt

npx replace-in-file "/__BEETPX_VERSION__/g" "${BEETPX_VERSION}" ./docs/index.html
npx replace-in-file "/__BEETPX_VERSION__/g" "${BEETPX_VERSION}" ./docs/robots.txt
