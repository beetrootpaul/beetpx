#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

watch=false
for arg in "$@"; do
	case "${arg}" in
	--watch) watch=true ;;
	*)
		echo "Unknown argument: '${arg}'. Usage: $0 [--watch]" >&2
		exit 1
		;;
	esac
done

# TODO: Maybe we can limit `packages` here to the external facing ones?
packages=(
	bpx
	bpxd
	internal
)
test_packages=(
	bpx
)
targets=(
	darwin_arm64
	js_wasm32
	linux_amd64
	windows_amd64
)

run_check() {
	# `-thread-count:1` works around an intermittent segmentation fault of the
	# multithreaded checker, seen in Odin
	# [`dev-2026-09:a2fb372b7`](https://github.com/odin-lang/Odin/releases/tag/dev-2026-09),
	# about once in 20 runs.
	#
	# TODO: Consider reporting this crash to Odin. Unless it is already
	#       fixed in a newer version.
	# TODO: Remove the single-threading once the issue is fixed.
	# TODO: Maybe we can limit `-vet-packages` here to the currently
	#       checked and the internals?
	local flags=(
		-disable-non-constant-globals
		-no-entry-point
		-strict-style
		-thread-count:1
		-vet
		-vet-cast
		-vet-tabs
		-vet-packages:beetpx_bpx,beetpx_bpxd,beetpx_internal,tests_bpx
		-vet-using-param
		-vet-using-stmt
		-warnings-as-errors
	)

	for package in "${packages[@]}"; do
		for target in "${targets[@]}"; do
			echo "Checking '${package}' for '${target}' ..."
			odin check "./beetpx/${package}" \
				"${flags[@]}" \
				-target:"${target}" ||
				return 1
		done
	done

	for package in "${test_packages[@]}"; do
		for target in "${targets[@]}"; do
			# Tests are not checked for the web: they import `core:testing`,
			# which depends on `core:os`, and `core:os` refuses to compile for
			# `js_wasm32`.
			if [[ "${target}" == js_wasm32 ]]; then
				continue
			fi
			echo "Checking tests of '${package}' for '${target}' ..."
			odin check "./tests/${package}" \
				-collection:beetpx=./beetpx/ \
				"${flags[@]}" \
				-target:"${target}" ||
				return 1
		done
	done
}

if [[ "${watch}" == true ]]; then
	if ! command -v watchexec >/dev/null; then
		echo "'--watch' requires watchexec: https://watchexec.github.io/" >&2
		exit 1
	fi
	exec watchexec \
		--clear \
		--exts odin \
		--watch ./beetpx \
		--watch ./tests \
		-- \
		./scripts/check_beetpx.sh
fi

run_check
echo "All checks passed."
