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

if [[ "${watch}" == true ]]; then
	if ! command -v watchexec >/dev/null; then
		echo "'--watch' requires watchexec: https://watchexec.github.io/" >&2
		exit 1
	fi
	exec watchexec \
		--clear \
		--exts odin \
		--watch ./beetpx \
		-- \
		./scripts/test_beetpx.sh
fi

run_tests
echo "All tests passed."
