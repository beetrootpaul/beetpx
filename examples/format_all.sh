#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

examples=(
	basic
	palettes
	shapes
	template_custom
	template_minimal
)

for example in "${examples[@]}"; do
	echo "Formatting '${example}' ..."
	odinfmt -w "./${example}"
done
