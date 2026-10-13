#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

examples=(
	basic
	canvas_snapshot
	palettes
	shapes
)

for example in "${examples[@]}"; do
	echo "Formatting '${example}' ..."
	odinfmt -w "./${example}"
done
