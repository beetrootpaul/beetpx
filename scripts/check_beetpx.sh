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
	core
	draw
	internal
	palettes
	utils
)
targets=(
	darwin_arm64
	js_wasm32
	linux_amd64
	windows_amd64
)

run_check() {
	for package in "${packages[@]}"; do
		for target in "${targets[@]}"; do
			echo "Checking '${package}' for '${target}' ..."
			# `-thread-count:1` works around an intermittent segmentation
			# fault of the multithreaded checker, seen in Odin
			# [`dev-2026-09:a2fb372b7`](https://github.com/odin-lang/Odin/releases/tag/dev-2026-09),
			# about once in 20 runs.
			#
			# TODO: Consider reporting this crash to Odin. Unless it is already
			#       fixed in a newer version.
			# TODO: Remove the single-threading once the issue is fixed.
			# TODO: Maybe we can limit `-vet-packages` here to the currently
			#       checked and the internals?
			odin check "./beetpx/${package}" \
				-disable-non-constant-globals \
				-no-entry-point \
				-strict-style \
				-thread-count:1 \
				-vet \
				-vet-cast \
				-vet-tabs \
				-vet-packages:beetpx_bpx,beetpx_core,beetpx_draw,beetpx_internal,beetpx_palettes,beetpx_utils \
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

# TODO: Can we share the `--watch` logic across scripts somehow? It's a lot of
#       code repeated, both in beetpx scripts as well as in the examples' ones.

compute_fingerprint_of_odin_files() {
	# Lists every `.odin` file with its modification time, its size, and its
	# path, one file per line, e.g.:
	#   1790752799 661 ./beetpx/draw/pixel.odin
	#   1790752799 1728 ./beetpx/core/platform_js.odin
	#
	# TODO: Make this work on linux as well. There is a chance `-c` should be
	# used there instead of `-f`.
	local files_list
	files_list="$(
		find ./beetpx \
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
		# Clears the terminal, so that only the output of the latest check is
		# visible. The escape sequences are:
		#   `\033[3J` - erases the scrollback,
		#   `\033[2J` - erases the visible screen,
		#   `\033[H`  - moves the cursor to the top-left corner.
		# `-t 1` skips this when the output is not a terminal, e.g. when it
		# is redirected to a file, which should not get the escape sequences.
		if [[ -t 1 ]]; then
			printf '\033[3J\033[2J\033[H'
		fi
		if run_check; then
			echo "All checks passed."
		fi
		echo "Watching for changes (Ctrl+C to stop) ..."
	fi
	sleep 1
done
