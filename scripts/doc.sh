#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

# The output is also the API snapshot, `beetpx/api.txt`. `check_code.sh` fails
# when the snapshot is out of date. To update it:
#   ./scripts/doc.sh > ./beetpx/api.txt

public_api_packages=(
	bpx
	bpxd
)

# `-thread-count:1` works around the same intermittent crash of the compiler
# as in `check_code.sh`.
#
# A fixed target makes the output the same on every host.
#
# TODO: Remove the single-threading once the issue is fixed.
odin_flags=(
	-target:js_wasm32
	-thread-count:1
)

for package in "${public_api_packages[@]}"; do
	odin doc "./beetpx/${package}" "${odin_flags[@]}"
done |
	# Makes the output stable, so it can be compared with the snapshot:
	# - drops the `fullpath:` and `files:` lists, which depend on the host
	#   and the target,
	# - drops the `/* 35!1158 */` markers, which change with the target and
	#   with every edit above a declaration,
	# - drops the trailing whitespace and the repeated empty lines.
	awk '
		/^\tfullpath:$/ { skip = 1; next }
		/^package / { skip = 0; if (printed) gap = 1 }
		skip { next }
		{
			sub(/ \/\* [0-9]+![0-9]+ \*\/$/, "")
			sub(/[ \t]+$/, "")
		}
		/^$/ { gap = 1; next }
		{
			if (gap && printed) print ""
			gap = 0
			printed = 1
			print
		}
	'
