# Colors the plain `odin doc` output without changing its text. It relies on
# its indentation: 1 tab for sections (and the package doc), 2 tabs for
# declarations, 3 tabs for their docs. Declaration names get the color of
# their section, and the rest of a declaration is bold.
#
# Used by `doc.sh`.

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
