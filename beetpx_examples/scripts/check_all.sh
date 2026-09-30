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

examples=(
	basic
)
targets=(
	darwin_arm64
	js_wasm32
)

run_check() {
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
				-target:"${target}" ||
				return 1
		done
	done
}

if [[ "${watch}" == false ]]; then
	run_check
	exit
fi

# TODO: Consider removing beetpx_core and other deps from watched files.
compute_fingerprint_of_odin_files() {
	# Lists every `.odin` file with its modification time, its size, and its
	# path, one file per line, e.g.:
	#   1790752809 244 ./basic/main.odin
	#   1790752799 661 ../beetpx_core/bpx/draw.odin
	#
	# `"${examples[@]/#/./}"` prefixes each example with `./`, so that `find`
	# reads it as a path rather than as an option.
	#
	# TODO: Make this work on linux as well. There is a chance `-c` should be
	# used there instead of `-f`.
	local files_list
	files_list="$(
		find "${examples[@]/#/./}" ../beetpx_core \
			-type f \
			-name '*.odin' \
			-exec stat -f '%m %z %N' {} +
	)"

	# Reduces the list to a single SHA-1 hash, which differs whenever the
	# list does, e.g.:
	#   3f786850e387550fdab836ed7e6dc881de23001b  -
	echo "${files_list}" | shasum
}

last_fingerprint=""
while true; do
	current_fingerprint="$(compute_fingerprint_of_odin_files)"
	if [[ "${current_fingerprint}" != "${last_fingerprint}" ]]; then
		last_fingerprint="${current_fingerprint}"
		if run_check; then
			echo "All checks passed."
		fi
		echo "Watching for changes (Ctrl+C to stop) ..."
	fi
	sleep 1
done
