#!/usr/bin/env bash
set -euo pipefail

# TODO: Hide most of this script boilerplate in BeetPx CLI.
# TODO: Make it run on Windows too, e.g. with a `.bat` file?

# TODO: Stay in the example's directory instead?
cd "$(dirname "${BASH_SOURCE[0]}")/../.."

rm -rf ./build/macos/
mkdir -p ./build/macos/

# TODO: Make the CLI's builds much more forgiving.
odin run ./beetpx_examples/basic \
	-collection:beetpx=./beetpx_core/ \
	-disable-non-constant-globals \
	-strict-style \
	-vet \
	-vet-cast \
	-vet-tabs \
	-vet-packages:main \
	-vet-using-param \
	-vet-using-stmt \
	-warnings-as-errors \
	-target:darwin_arm64 \
	-out:build/macos/basic
