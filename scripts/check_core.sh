#!/usr/bin/env bash
set -euo pipefail

# Checks the correctness of the Odin code of the entire beetpx_core, for every
# package and every supported target.
#
# It uses every vet flag Odin has, except `-vet-unused-procedures`, which the
# `#+vet` tags in the private `bpx` files enable for those files only. The
# tagged files get vetted as part of every game build too, with whatever vet
# flags the game uses, so they have to pass all of them.

cd "$(dirname "${BASH_SOURCE[0]}")/.."

packages=(
	bpx
	palettes
)
targets=(
	darwin_arm64
	js_wasm32
)

for package in "${packages[@]}"; do
	for target in "${targets[@]}"; do
		echo "Checking '${package}' for '${target}' ..."
		odin check "./beetpx_core/${package}" \
			-disable-non-constant-globals \
			-no-entry-point \
			-strict-style \
			-vet \
			-vet-cast \
			-vet-tabs \
			-vet-packages:bpx,palettes \
			-vet-using-param \
			-vet-using-stmt \
			-warnings-as-errors \
			-target:"${target}"
	done
done
