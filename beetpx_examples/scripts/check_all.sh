#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

examples=(
	basic
)
targets=(
	darwin_arm64
	js_wasm32
)

for example in "${examples[@]}"; do
	for target in "${targets[@]}"; do
		echo "Checking '${example}' for '${target}' ..."
		odin check "./${example}" \
			-collection:beetpx=../beetpx_core/ \
			-disable-non-constant-globals \
			-strict-style \
			-vet \
			-vet-cast \
			-vet-tabs \
			-vet-packages:main \
			-vet-using-param \
			-vet-using-stmt \
			-warnings-as-errors \
			-target:"${target}"
	done
done
