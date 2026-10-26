#!/usr/bin/env bash
set -euo pipefail

# TODO: Hide most of this script boilerplate in BeetPx CLI. Ideally something 
#       like `brew install beetpx`?
# TODO: Make it run on Windows too, e.g. with a `.bat` file? Also make sure it
# runs on linux.

cd "$(dirname "${BASH_SOURCE[0]}")"

# TODO: Support more targets, e.g. `linux_amd64` and `windows_amd64`.
targets=(
	darwin_arm64
	js_wasm32
)
# TODO: Consider making examples auto-discoverable… unless we expect any of them
#       to not follow the same convention.
examples=(
	basic
	buttons
	palettes
	shapes
)

usage="Usage: $0 <target> <example> [--hot]"

if [[ $# -lt 2 || $# -gt 3 ]]; then
	echo "${usage}" >&2
	exit 1
fi
target="$1"
example="$2"
hot=false
if [[ $# -eq 3 ]]; then
	if [[ "$3" != --hot ]]; then
		echo "Unknown argument: '$3'." >&2
		echo "${usage}" >&2
		exit 1
	fi
	hot=true
fi

# Params:
#   $1 - the actual value
#   $2 - 1st allowed value
#   $3 - 2nd allowed value
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

odin_flags=(
	-collection:beetpx=../beetpx/
	-target:"${target}"
)

# Prints a command which builds the example for hot reload into the file `$1`,
# with the extra Odin flags `$2`, `$3`, and so on. It builds into a temp file
# first, and then renames it, so that a half-written file is never loaded.
hot_build_command() {
	local out="$1"
	shift
	local tmp
	tmp="$(dirname "${out}")/tmp_$(basename "${out}")"
	printf '%q ' odin build "./${example}" \
		"${odin_flags[@]}" \
		-define:BPX_HOT=true \
		"$@" \
		-out:"${tmp}"
	printf '&& mv %q %q' "${tmp}" "${out}"
}

# Runs the command `$1` in the background whenever an `.odin` file of the
# example or of BeetPx changes, until this script exits.
rerun_on_changes() {
	if ! command -v watchexec >/dev/null; then
		echo "'--hot' requires watchexec: https://watchexec.github.io/" >&2
		exit 1
	fi
	watchexec \
		--postpone \
		--shell=bash \
		--exts odin \
		--watch "./${example}" \
		--watch ../beetpx \
		-- "$1" &
	# shellcheck disable=SC2064 # Expands `$!` now, on purpose.
	trap "kill $!" EXIT
}

case "${target}" in
darwin_arm64)
	if [[ "${hot}" == true ]]; then
		rm -rf ./build/macos_hot/
		mkdir -p ./build/macos_hot/

		# The host runs the example from the library, and reloads it
		# whenever the file changes.
		odin build ../beetpx/hot_host \
			-target:"${target}" \
			-out:build/macos_hot/hot_host

		lib="build/macos_hot/${example}.dylib"
		build_lib="$(hot_build_command "${lib}" -build-mode:dll)"
		eval "${build_lib}"
		rerun_on_changes "${build_lib}"

		./build/macos_hot/hot_host "${lib}"
		exit
	fi

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
	if [[ "${hot}" == true ]]; then
		# The page swaps the running example for the new one whenever the
		# file changes.
		build_wasm="$(hot_build_command build/web/beetpx_game.wasm)"
		eval "${build_wasm}"
		rerun_on_changes "${build_wasm}"
	else
		odin build "./${example}" \
			"${odin_flags[@]}" \
			-out:build/web/beetpx_game.wasm
	fi
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
