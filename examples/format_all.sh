#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

# TODO: Consider making examples auto-discoverable… unless we expect any of them
#       to not follow the same convention.
examples=(
	basic
	buttons
	palettes
	shapes
)

for example in "${examples[@]}"; do
	echo "Formatting '${example}' ..."
	odinfmt -w "./${example}"
done
