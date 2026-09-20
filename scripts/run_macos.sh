#!/usr/bin/env bash
set -euo pipefail

# Go to the repo root, since the further script assumes relative paths from it.
cd "$(dirname "${BASH_SOURCE[0]}")/.."

rm -rf ./build/macos/
mkdir -p ./build/macos/

odin run ./beetpx_examples/basic \
    -target:darwin_arm64 \
    -out:build/macos/basic
