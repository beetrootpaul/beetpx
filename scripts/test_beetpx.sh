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

run_tests() {
	# Tests live next to the code they test, in `*.test.odin` files, so only
	# the packages that have such files are tested, e.g.:
	#   ./beetpx/utils
	local packages
	packages="$(
		find ./beetpx -type f -name '*.test.odin' -exec dirname {} \; |
			sort -u
	)"
	if [[ -z "${packages}" ]]; then
		echo "No tests found."
		return 0
	fi

	# Tests all the packages, even after one of them fails, so that a single
	# run reports every failure.
	local failed=false
	local package
	while IFS= read -r package; do
		echo "Testing '${package}' ..."
		# `-thread-count:1` works around the same intermittent crash of the
		# compiler as in `check_beetpx.sh`.
		#
		# `ODIN_TEST_FAIL_ON_BAD_MEMORY` makes a test fail when it leaks memory
		# or frees memory it should not. Without it, the test runner only warns
		# about such problems and still reports the test as successful.
		#
		# TODO: Remove the single-threading once the issue is fixed.
		#
		# The `ODIN_TEST_*` defines shorten the output: `LOG_LEVEL=warning`
		# hides the runner's informational header, and `SHORT_LOGS` drops the
		# date, time, and procedure name from every log line.
		odin test "${package}" -thread-count:1 \
			-define:ODIN_TEST_FAIL_ON_BAD_MEMORY=true \
			-define:ODIN_TEST_LOG_LEVEL=warning \
			-define:ODIN_TEST_SHORT_LOGS=true ||
			failed=true
	done <<<"${packages}"

	# Being the last command, this test sets the function's exit status:
	# success only if every package passed, failure if any of them failed.
	[[ "${failed}" == false ]]
}

if [[ "${watch}" == false ]]; then
	run_tests
	exit
fi

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
		# Clears the terminal, so that only the output of the latest run is
		# visible. The escape sequences are:
		#   `\033[3J` - erases the scrollback,
		#   `\033[2J` - erases the visible screen,
		#   `\033[H`  - moves the cursor to the top-left corner.
		# `-t 1` skips this when the output is not a terminal, e.g. when it
		# is redirected to a file, which should not get the escape sequences.
		if [[ -t 1 ]]; then
			printf '\033[3J\033[2J\033[H'
		fi
		if run_tests; then
			echo "All tests passed."
		fi
		echo "Watching for changes (Ctrl+C to stop) ..."
	fi
	sleep 1
done
