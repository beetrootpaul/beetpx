#!/usr/bin/env bash
set -euo pipefail

# TODO: Hide most of this script boilerplate in BeetPx CLI.
# TODO: Make the script cross-platform. Right now it won't run on Windows, right? Let's add a .bat file maybe?

# Go to the repo root, since the further script assumes relative paths from it.
#
# TODO: Shouldn't we stay in the example's dir?
cd "$(dirname "${BASH_SOURCE[0]}")/../.."

rm -rf ./build/macos/
mkdir -p ./build/macos/

# TODO: In CLI make build way more forgiving.
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
