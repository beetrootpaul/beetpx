#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

public_api_packages=(
	bpx
	bpxd
)

# `-thread-count:1` works around the same intermittent crash of the compiler
# as in `check_code.sh`.
#
# TODO: Remove the single-threading once the issue is fixed.
odin_flags=(
	-thread-count:1
)

for package in "${public_api_packages[@]}"; do
	odin doc "./beetpx/${package}" "${odin_flags[@]}"
done
