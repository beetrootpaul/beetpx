#!/usr/bin/env bash
set -euo pipefail

# TODO: Hide most of this script boilerplate in BeetPx CLI.
# TODO: Make the script cross-platform. Right now it won't run on Windows, right?

# Go to the repo root, since the further script assumes relative paths from it.
cd "$(dirname "${BASH_SOURCE[0]}")/.."

rm -rf ./build/macos/
mkdir -p ./build/macos/

odin run ./beetpx_examples/basic \
	-collection:beetpx_core=./beetpx_core/ \
	-target:darwin_arm64 \
	-out:build/macos/basic
