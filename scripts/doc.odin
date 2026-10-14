package scripts

import "core:fmt"
import "core:os"
import "core:strings"
import "core:terminal"
import "core:terminal/ansi"

@(private = "file")
_PUBLIC_API_PACKAGES :: [?]string{"bpx", "bpxd"}

// Prints the public API of BeetPx, with `odin doc`.
//
// Colors are on by default in a terminal. `--no-color` turns them off.
doc :: proc(args: []string) -> (ok: bool) {
	color := terminal.is_terminal(os.stdout)
	for arg in args {
		switch arg {
		case "--no-color":
			color = false
		case:
			fmt.eprintfln(
				"Unknown argument: '%s'. Usage: doc [--no-color]",
				arg,
			)
			return false
		}
	}

	for package_name in _PUBLIC_API_PACKAGES {
		path := fmt.tprintf("./beetpx/%s", package_name)
		// `-thread-count:1` works around the same intermittent crash of the
		// compiler as in `check_code.sh`.
		//
		// TODO: Remove the single-threading once the issue is fixed.
		out := _exec({"odin", "doc", path, "-thread-count:1"}) or_return
		defer delete(out)

		if color {
			os.write_string(os.stdout, _colorize(out, context.temp_allocator))
		} else {
			os.write_string(os.stdout, out)
		}
	}

	return true
}

@(private = "file")
_RESET :: ansi.CSI + ansi.RESET + ansi.SGR
@(private = "file")
_BOLD :: ansi.CSI + ansi.BOLD + ansi.SGR
@(private = "file")
_INVERT :: ansi.CSI + ansi.INVERT + ansi.SGR
@(private = "file")
_GREY :: ansi.CSI + ansi.FG_BRIGHT_BLACK + ansi.SGR
@(private = "file")
_PACKAGE_STYLE ::
	ansi.CSI +
	ansi.BOLD +
	";" +
	ansi.INVERT +
	";" +
	ansi.FG_COLOR_8_BIT +
	";221" +
	ansi.SGR
@(private = "file")
_LOCATION_STYLE :: ansi.CSI + ansi.FAINT + ansi.SGR

@(private = "file")
_section_color :: proc(section: string) -> (color: string, ok: bool) {
	switch section {
	case "constants":
		return ansi.CSI + ansi.FG_COLOR_8_BIT + ";81" + ansi.SGR, true
	case "variables":
		return ansi.CSI + ansi.FG_COLOR_8_BIT + ";214" + ansi.SGR, true
	case "procedures":
		return ansi.CSI + ansi.FG_COLOR_8_BIT + ";205" + ansi.SGR, true
	case "proc_group":
		return ansi.CSI + ansi.FG_COLOR_8_BIT + ";141" + ansi.SGR, true
	case "types":
		return ansi.CSI + ansi.FG_COLOR_8_BIT + ";114" + ansi.SGR, true
	case "fullpath:", "files:":
		return _GREY, true
	}
	return "", false
}

// Colors the plain `odin doc` output without changing its text. It relies on
// its indentation: 1 tab for sections (and the package doc), 2 tabs for
// declarations, 3 tabs for their docs. Declaration names get the color of
// their section, and the rest of a declaration is bold.
@(private = "file")
_colorize :: proc(text: string, allocator := context.allocator) -> string {
	b := strings.builder_make(allocator)

	section: string
	in_package_doc, in_files: bool

	text := text
	for line in strings.split_lines_iterator(&text) {
		if strings.has_prefix(line, "package ") {
			in_package_doc = true
			fmt.sbprintfln(&b, "\n%s %s %s", _PACKAGE_STYLE, line, _RESET)
			continue
		}

		if strings.has_prefix(line, "\t") &&
		   !strings.has_prefix(line, "\t\t") {
			if color, is_section := _section_color(line[1:]); is_section {
				in_package_doc = false
				section = line[1:]
				in_files = strings.has_suffix(section, ":")
				fmt.sbprintfln(
					&b,
					"\t%s%s%s %s %s",
					_BOLD,
					_INVERT,
					color,
					section,
					_RESET,
				)
				continue
			}
		}

		if in_files && strings.has_prefix(line, "\t\t") {
			fmt.sbprintfln(&b, "%s%s%s", _GREY, line, _RESET)
			continue
		}

		if strings.has_prefix(line, "\t\t") &&
		   !strings.has_prefix(line, "\t\t\t") &&
		   len(line) > 2 &&
		   !in_package_doc {
			definition := line[2:]
			location := ""
			if i, found := _location_start(definition); found {
				location = definition[i:]
				definition = definition[:i]
			}
			name_end := strings.index_byte(definition, ' ')
			if name_end < 0 {
				name_end = len(definition)
			}
			color, _ := _section_color(section)
			fmt.sbprintf(
				&b,
				"\t\t%s%s%s%s%s%s",
				_BOLD,
				color,
				definition[:name_end],
				_RESET,
				_BOLD,
				definition[name_end:],
			)
			if location != "" {
				fmt.sbprintfln(
					&b,
					"%s%s%s%s",
					_RESET,
					_LOCATION_STYLE,
					location,
					_RESET,
				)
			} else {
				fmt.sbprintln(&b, _RESET)
			}
			continue
		}

		fmt.sbprintln(&b, line)
	}

	return strings.to_string(b)
}

// Finds where a ` /* 12!34 */` location suffix of a declaration starts.
@(private = "file")
_location_start :: proc(definition: string) -> (start: int, found: bool) {
	if !strings.has_suffix(definition, " */") {
		return 0, false
	}
	start = strings.last_index(definition, " /* ")
	if start < 0 {
		return 0, false
	}
	numbers := definition[start + len(" /* "):len(definition) - len(" */")]
	left, _, right := strings.partition(numbers, "!")
	return start, _is_digits(left) && _is_digits(right)
}

@(private = "file")
_is_digits :: proc(s: string) -> bool {
	if len(s) == 0 {
		return false
	}
	for c in s {
		if c < '0' || c > '9' {
			return false
		}
	}
	return true
}
