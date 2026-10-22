#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Colors are on by default in a terminal. `--no-color` turns them off.
color=false
if [[ -t 1 ]]; then
	color=true
fi

for arg in "$@"; do
	case "${arg}" in
	--no-color) color=false ;;
	*)
		echo "Unknown argument: '${arg}'. Usage: $0 [--no-color]" >&2
		exit 1
		;;
	esac
done

public_api_packages=(
	bpx
	bpxd
)

# `-thread-count:1` works around the same intermittent crash of the compiler
# as in `check.sh`.
#
# TODO: Remove the single-threading once the issue is fixed.
odin_flags=(
	-thread-count:1
)

print_docs() {
	for package in "${public_api_packages[@]}"; do
		odin doc "./beetpx/${package}" "${odin_flags[@]}"
	done
}

if [[ "${color}" == true ]]; then
	print_docs | awk -f ./scripts/doc_colorize.awk
else
	print_docs
fi
