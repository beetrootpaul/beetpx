#!/usr/bin/env sh

# This script is meant to be run from a repository's root directory.

set -e
set -x

BEETPX_VERSION="$(node -p -e "require('./package.json').version")"

npx open-cli "./docs/docs/${BEETPX_VERSION}/index.html"
