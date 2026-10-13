package beetpx_bpx

// The platform the game runs on, picked at build time with
// `-define:BEETPX_PLATFORM=<name>`:
// - "" (the default): SDL on desktop, the browser on the web.
// - "nil": no window, no rendering, and no clock, e.g. for running a game in
//   `odin test`. See `nil_platform_step`.
@(private)
_PLATFORM :: #config(BEETPX_PLATFORM, "")

#assert(
	_PLATFORM == "" || _PLATFORM == "nil",
	"BEETPX_PLATFORM has to be either empty or \"nil\".",
)

@(private)
_platform_start :: proc() {
	when _PLATFORM == "nil" {
		_platform_nil_start()
	} else when ODIN_OS == .JS {
		_platform_js_start()
	} else {
		_platform_sdl_start()
	}
}

@(private)
_platform_render :: proc() {
	when _PLATFORM == "nil" {
		_platform_nil_render()
	} else when ODIN_OS == .JS {
		_platform_js_render()
	} else {
		_platform_sdl_render()
	}
}
