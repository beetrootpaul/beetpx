#!/usr/bin/env bash
set -euo pipefail

# TODO: Hide most of this script boilerplate in BeetPx CLI.
# TODO: Make it run on Windows too, e.g. with a `.bat` file? Also make sure it
# runs on linux.

cd "$(dirname "${BASH_SOURCE[0]}")/.."

# TODO: Support more targets, e.g. `linux_amd64` and `windows_amd64`.
targets=(
	darwin_arm64
	js_wasm32
)
examples=(
	basic
)

# Examples, from the repository root:
#   ./examples/scripts/run.sh darwin_arm64 basic
#   ./examples/scripts/run.sh js_wasm32 basic
#   ./examples/scripts/run.sh darwin_arm64 basic --track-memory
#   ./examples/scripts/run.sh darwin_arm64 basic --sanitize=address
#   ./examples/scripts/run.sh darwin_arm64 basic --sanitize=thread
#   ./examples/scripts/run.sh darwin_arm64 basic --track-memory --sanitize=address
#   ./examples/scripts/run.sh js_wasm32 basic --track-memory
#
# `--track-memory` and `--sanitize=...` are for memory debugging. What they
# report, and how that differs between desktop and web, is described at the
# top of `beetpx/core/memory_tracking.odin`.
usage="Usage: $0 <target> <example> [--track-memory] [--sanitize=<sanitizer>]"

positional_args=()
track_memory=false
sanitizer=""
for arg in "$@"; do
	case "${arg}" in
	--track-memory) track_memory=true ;;
	--sanitize=*) sanitizer="${arg#--sanitize=}" ;;
	--*)
		echo "Unknown option: '${arg}'." >&2
		echo "${usage}" >&2
		exit 1
		;;
	*) positional_args+=("${arg}") ;;
	esac
done

if [[ ${#positional_args[@]} -ne 2 ]]; then
	echo "${usage}" >&2
	exit 1
fi
target="${positional_args[0]}"
example="${positional_args[1]}"

# Params:
#   $1 - the actual value
#   $2 - 1st allowed value
#   $3 - 3nd allowed value
#   .. - (and so on)
is_one_of() {
	local value="$1"
	shift
	local allowed
	for allowed in "$@"; do
		if [[ "${value}" == "${allowed}" ]]; then
			return 0
		fi
	done
	return 1
}

if ! is_one_of "${target}" "${targets[@]}"; then
	echo "Unsupported target: '${target}'. Supported: ${targets[*]}." >&2
	echo "${usage}" >&2
	exit 1
fi
if ! is_one_of "${example}" "${examples[@]}"; then
	echo "Unknown example: '${example}'. Available: ${examples[*]}." >&2
	echo "${usage}" >&2
	exit 1
fi

# TODO: Make the CLI's builds much more forgiving than this here.
odin_flags=(
	-collection:beetpx=../beetpx/
	-disable-non-constant-globals
	-strict-style
	-vet
	-vet-cast
	-vet-tabs
	-vet-packages:main
	-vet-using-param
	-vet-using-stmt
	-warnings-as-errors
	-target:"${target}"
)

# Builds the engine with a tracking allocator, which prints the memory in use
# whenever it changes, and the leaks on app exit. See `_TRACK_MEMORY` in
# `beetpx/core/memory_tracking.odin`.
if [[ "${track_memory}" == true ]]; then
	odin_flags+=(-define:BPX_TRACK_MEMORY=true)
fi

# Builds the game with one of the LLVM sanitizers, which stop the app with a
# report on the first error they detect:
#   `address` - out-of-bounds accesses and uses of freed memory,
#   `thread`  - data races between threads.
# Odin allows only one sanitizer per build, and none on the web. There is also
# `memory` (reads of uninitialized memory), which Odin supports only on Linux
# and FreeBSD. `-debug` adds the debug info that turns the addresses in the
# reports into file names and line numbers.
if [[ -n "${sanitizer}" ]]; then
	if [[ "${target}" == js_wasm32 ]]; then
		echo "Sanitizers are not supported on '${target}'." >&2
		exit 1
	fi
	if ! is_one_of "${sanitizer}" address thread; then
		echo "Unsupported sanitizer: '${sanitizer}'. Supported: address thread." >&2
		echo "${usage}" >&2
		exit 1
	fi
	odin_flags+=(-sanitize:"${sanitizer}" -debug)
fi

case "${target}" in
darwin_arm64)
	rm -rf ./build/macos/
	mkdir -p ./build/macos/

	odin run "./${example}" \
		"${odin_flags[@]}" \
		-out:"build/macos/${example}"
	;;
js_wasm32)
	rm -rf ./build/web/
	mkdir -p ./build/web/

	# TODO: Name the WASM file after the game ID or something.
	odin build "./${example}" \
		"${odin_flags[@]}" \
		-out:build/web/beetpx_game.wasm
	cp "$(odin root)/core/sys/wasm/js/odin.js" ./build/web/odin.js
	cp ../beetpx/beetpx.js ./build/web/beetpx.js
	cp ./index.html ./build/web/index.html

	echo "Serving ./build/web/ at http://127.0.0.1:8000 ..."
	python3 -m http.server 8000 \
		--bind 127.0.0.1 \
		--directory ./build/web/
	;;
esac
