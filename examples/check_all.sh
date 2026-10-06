#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

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

examples=(
	basic
	palettes
)
targets=(
	darwin_arm64
	js_wasm32
)

run_check() {
	for example in "${examples[@]}"; do
		for target in "${targets[@]}"; do
			echo "Checking '${example}' for '${target}' ..."
			# `-thread-count:1` works around an intermittent segmentation
			# fault of the multithreaded checker, seen in Odin
			# [`dev-2026-09:a2fb372b7`](https://github.com/odin-lang/Odin/releases/tag/dev-2026-09),
			# about once in 20 runs.
			#
			# TODO: Consider reporting this crash to Odin. Unless it is already
			#       fixed in a newer version.
			# TODO: Remove the single-threading once the issue is fixed.
			odin check "./${example}" \
				-collection:beetpx=../beetpx/ \
				-disable-non-constant-globals \
				-strict-style \
				-thread-count:1 \
				-vet \
				-vet-cast \
				-vet-tabs \
				-vet-packages:main \
				-vet-using-param \
				-vet-using-stmt \
				-warnings-as-errors \
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
	# Watches every example and BeetPx itself, e.g.:
	#   --watch ./basic --watch ../beetpx
	#
	# `"${examples[@]/#/./}"` prefixes each example with `./`, so that it reads
	# as a path.
	#
	# TODO: Consider removing beetpx and other deps from watched files.
	watch_args=()
	for watched_path in "${examples[@]/#/./}" ../beetpx; do
		watch_args+=(--watch "${watched_path}")
	done
	exec watchexec \
		--clear \
		--exts odin "${watch_args[@]}" \
		-- \
		./check_all.sh
fi

run_check
echo "All checks passed."
