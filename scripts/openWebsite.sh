#!/usr/bin/env sh

# This script is meant to be run from a repository's root directory.

set -e
set -x

npx @node-cli/static-server \
  --open \
  ./docs/
