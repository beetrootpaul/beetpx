#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Colors are on by default in a terminal. `--no-color` turns them off.
color=false
if [[ -t 1 ]]; then
	color=true
fi

for arg in "$@"; do
	case "${arg}" in
	--no-color) color=false ;;
	*)
		echo "Unknown argument: '${arg}'. Usage: $0 [--no-color]" >&2
		exit 1
		;;
	esac
done

public_api_packages=(
	bpx
	bpxd
)

# `-thread-count:1` works around the same intermittent crash of the compiler
# as in `check_code.sh`.
#
# TODO: Remove the single-threading once the issue is fixed.
odin_flags=(
	-thread-count:1
)

print_docs() {
	for package in "${public_api_packages[@]}"; do
		odin doc "./beetpx/${package}" "${odin_flags[@]}"
	done
}

# Colors the plain `odin doc` output without changing its text. It relies on
# its indentation: 1 tab for sections (and the package doc), 2 tabs for
# declarations, 3 tabs for their docs. Declaration names get the color of
# their section, and the rest of a declaration is bold.
colorize() {
	awk '
		BEGIN {
			reset = "\033[0m"
			bold = "\033[1m"
			inverse = "\033[7m"
			package_style = "\033[1;7;38;5;221m"
			grey = "\033[90m"
			location_style = "\033[2m"
			colors["constants"] = "\033[38;5;81m"
			colors["variables"] = "\033[38;5;214m"
			colors["procedures"] = "\033[38;5;205m"
			colors["proc_group"] = "\033[38;5;141m"
			colors["types"] = "\033[38;5;114m"
			colors["fullpath:"] = grey
			colors["files:"] = grey
		}
		/^package / {
			in_package_doc = 1
			print ""
			print package_style " " $0 " " reset
			next
		}
		/^\t[^\t]+$/ && (substr($0, 2) in colors) {
			in_package_doc = 0
			section = substr($0, 2)
			in_files = (section ~ /:$/)
			print "\t" bold inverse colors[section] " " section " " reset
			next
		}
		in_files && /^\t\t/ {
			print grey $0 reset
			next
		}
		/^\t\t[^\t]/ && !in_package_doc {
			definition = substr($0, 3)
			location = ""
			if (match(definition, / \/\* [0-9]+![0-9]+ \*\/$/)) {
				location = location_style substr(definition, RSTART) reset
				definition = substr(definition, 1, RSTART - 1)
			}
			match(definition, /^[^ ]+/)
			name = substr(definition, 1, RLENGTH)
			definition = substr(definition, RLENGTH + 1)
			print "\t\t" bold colors[section] name reset \
				bold definition reset location
			next
		}
		{ print }
	'
}

if [[ "${color}" == true ]]; then
	print_docs | colorize
else
	print_docs
fi
