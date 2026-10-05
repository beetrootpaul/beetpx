#!/usr/bin/env bash
set -euo pipefail

# TODO: Hide most of this script boilerplate in BeetPx CLI.
# TODO: Make it run on Windows too, e.g. with a `.bat` file? Also make sure it
# runs on linux.

cd "$(dirname "${BASH_SOURCE[0]}")"

# TODO: Support more targets, e.g. `linux_amd64` and `windows_amd64`.
targets=(
	darwin_arm64
	js_wasm32
)
examples=(
	basic
)

usage="Usage: $0 <target> <example>"

if [[ $# -ne 2 ]]; then
	echo "${usage}" >&2
	exit 1
fi
target="$1"
example="$2"

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
	# TODO: Make it no longer require python3 (Odin 1.0 is supposed to include
	#       HTTP server) or make it explicit in the script (fail the script if
	#       the dependency is not here?). Make sure it is cross-platform.
	python3 -m http.server 8000 \
		--bind 127.0.0.1 \
		--directory ./build/web/
	;;
esac
