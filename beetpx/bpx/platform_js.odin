package beetpx_bpx

import "../internal"
import "core:fmt"
import js "core:sys/wasm/js"

// Implemented in JavaScript by `beetpx.js`, which passes them to
// `odin.runWasm` as extra foreign imports under the "beetpx" key.
foreign import beetpx_js "beetpx"

// TODO: When implementing a custom logger, enforce logs to end with `\n` on JS
//       (e.g through calling ln-suffixed fmt procs), othewise the ooutput does
//       not show up in the console.

@(default_calling_convention = "contextless")
@(private = "file")
foreign beetpx_js {
	// Prepares the `<canvas>` element with the given `id` to render a canvas
	// of the given size. Returns `false` if that is not possible.
	@(link_name = "html_canvas_init")
	_beetpx_js_html_canvas_init :: proc(canvas_element_id: string, width, height: int) -> bool ---

	// Draws the RGBA8 bytes of the canvas onto the `<canvas>` element, scaled
	// by the largest whole number that fits, and centered.
	@(link_name = "html_canvas_render")
	_beetpx_js_html_canvas_render :: proc(rgba8_bytes: []u8) ---

	// Starts fetching the asset from `path`, relative to the hosting HTML page.
	@(link_name = "asset_fetch")
	_beetpx_js_asset_fetch :: proc(path: string) ---

	@(link_name = "asset_copy_fetched_bytes")
	_beetpx_js_asset_copy_fetched_bytes :: proc(path: string, bytes: []u8) ---
}

// Must match the `id` of the `<canvas>` element in the hosting HTML page.
//
// TODO: Make the ID configurable, or check at build time that the page
// matches?
@(private = "file")
_CANVAS_ELEMENT_ID :: "beetpx_canvas"

// Starts fetching the asset in a non-blocking manner.
@(private)
_platform_load_asset :: proc(path: string) {
	_beetpx_js_asset_fetch(path)
}

@(export, link_name = "beetpx_asset_fetch_success")
@(private = "file")
_on_asset_fetch_success :: proc(path: string, size: int) {
	bytes := make([]u8, size)
	// TODO: Can we make this flow easier to undestand?
	//
	// Here the data fetched by JS gets copied into `bytes`.
	_beetpx_js_asset_copy_fetched_bytes(path, bytes)
	_assets_on_asset_loaded(path, bytes)
}

@(export, link_name = "beetpx_asset_fetch_failure")
@(private = "file")
_on_asset_fetch_failure :: proc(path: string) {
	// TODO: Use a custom logger.
	fmt.eprintln("BeetPx: failed to fetch an asset:", path)
	_assets_on_asset_load_failed(path)
}

@(private)
_platform_start :: proc() {
	canvas_size := internal.canvas_size()
	if !_beetpx_js_html_canvas_init(
		_CANVAS_ELEMENT_ID,
		canvas_size.x,
		canvas_size.y,
	) {
		// TODO: Use a custom logger.
		fmt.eprintln(
			"BeetPx: failed to set up the canvas with id:",
			_CANVAS_ELEMENT_ID,
		)
		return
	}

	js.add_window_event_listener(.Key_Down, nil, _on_key_down)
	js.add_window_event_listener(.Key_Up, nil, _on_key_up)
	// Once the page loses focus, it no longer gets the events of the keys
	// released from then on, so all of them are treated as released.
	js.add_window_event_listener(.Blur, nil, _on_blur)

	internal.canvas_fill({0, 0, 0})
}

@(private = "file")
_on_key_down :: proc(e: js.Event) {
	button, ok := _button_for_code(e.key.code)
	if !ok do return

	// Stops the browser from acting on the key, e.g. from scrolling the page
	// on an arrow key. This applies to the repeated events as well.
	js.event_prevent_default()

	// The host OS repeats the event while the key is held. The repeats are
	// ignored, so that every game behaves the same on every host.
	if e.key.repeat do return

	_buttons_on_down(&_s.buttons, button)
}

@(private = "file")
_on_key_up :: proc(e: js.Event) {
	button, ok := _button_for_code(e.key.code)
	if !ok do return

	js.event_prevent_default()

	_buttons_on_up(&_s.buttons, button)
}

@(private = "file")
_on_blur :: proc(e: js.Event) {
	_buttons_on_all_up(&_s.buttons)
}

// TODO: Let players remap the keys.
@(private = "file")
_button_for_code :: proc(code: string) -> (button: Button, ok: bool) {
	switch code {
	case "ArrowLeft":
		return .Left, true
	case "ArrowRight":
		return .Right, true
	case "ArrowUp":
		return .Up, true
	case "ArrowDown":
		return .Down, true
	}
	return {}, false
}

@(private)
_platform_render :: proc() {
	_beetpx_js_html_canvas_render(internal.canvas_rgba8_bytes())
}

// Called once per host animation frame by `odin.js`. Has to be called `step`.
//
// Returns `false` to end the game, after which `odin.js` stops calling `step`
// and ends the program.
//
// See: https://github.com/odin-lang/Odin/blob/f1fd03364d5e45a987e1cd354188a3f018f45d1c/core/sys/wasm/js/odin.js#L2258-L2284
//
// TODO: Clean up this export attribute and proc name.
@(export)
@(private = "file")
step :: proc(delta_s: f64) -> bool {
	return _game_loop_advance(delta_s)

}
