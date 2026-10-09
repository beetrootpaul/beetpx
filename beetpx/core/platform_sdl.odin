#+build darwin, linux, windows
package beetpx_core

import "../internal"
import "core:c"
import "core:fmt"
import sdl "vendor:sdl3"

// The window opens with the canvas at the largest whole-number scale that
// fits within this fraction of the display's usable area, so that it is
// big, yet leaves some of the display free around it.
@(private = "file")
_INITIAL_WINDOW_MAX_DISPLAY_FRACTION :: 0.75

// The initial scale used when the display's usable area is unknown.
@(private = "file")
_FALLBACK_INITIAL_SCALE :: 4

@(private = "file")
_sdl_renderer: ^sdl.Renderer
@(private = "file")
_sdl_canvas_texture: ^sdl.Texture

// TODO: Check every SDL3 call here against the SDL3 docs, and tune the
// settings.
@(private)
_platform_start :: proc() {
	if !sdl.Init({.VIDEO}) {
		fmt.eprintln("BeetPx: sdl.Init failed:", sdl.GetError())
		return
	}
	defer sdl.Quit()

	canvas_size := internal.canvas_size()
	initial_scale := _initial_scale(canvas_size)

	sdl_window: ^sdl.Window
	ok := sdl.CreateWindowAndRenderer(
		"BeetPx",
		c.int(canvas_size.x * initial_scale),
		c.int(canvas_size.y * initial_scale),
		// `HIGH_PIXEL_DENSITY` makes SDL render to all the physical pixels of
		// a high-DPI display, such as Retina on macOS, a display scaled above
		// 100% on Windows, or a scaled one on Wayland. Without it, SDL renders
		// at a lower resolution, and the OS upscales the result, which can
		// blur the pixel edges.
		{.RESIZABLE, .HIGH_PIXEL_DENSITY},
		&sdl_window,
		&_sdl_renderer,
	)
	if !ok {
		fmt.eprintln(
			"BeetPx: sdl.CreateWindowAndRenderer failed:",
			sdl.GetError(),
		)
		return
	}
	defer sdl.DestroyRenderer(_sdl_renderer)
	defer sdl.DestroyWindow(sdl_window)

	// `INTEGER_SCALE` scales the canvas only by whole numbers, so every canvas
	// pixel is the same number of physical pixels wide and tall. The rest of
	// the window is left as black bars.
	sdl.SetRenderLogicalPresentation(
		_sdl_renderer,
		c.int(canvas_size.x),
		c.int(canvas_size.y),
		.INTEGER_SCALE,
	)
	sdl.SetRenderVSync(_sdl_renderer, 1)

	// `RGBA32` means the R, G, B, A bytes in this order in memory, on any
	// endianness, which is how the canvas stores its pixels.
	_sdl_canvas_texture = sdl.CreateTexture(
		_sdl_renderer,
		.RGBA32,
		.STREAMING,
		c.int(canvas_size.x),
		c.int(canvas_size.y),
	)
	if _sdl_canvas_texture == nil {
		fmt.eprintln("BeetPx: sdl.CreateTexture failed:", sdl.GetError())
		return
	}
	defer sdl.DestroyTexture(_sdl_canvas_texture)
	sdl.SetTextureScaleMode(_sdl_canvas_texture, .NEAREST)

	// TODO: Use a custom logger.
	fmt.printfln("BeetPx (%v) started.", ODIN_OS)

	internal.canvas_fill(&internal.canvas, {0, 0, 0})

	_run_game_loop()
}

// TODO: Check every SDL3 call here against the SDL3 docs.
@(private)
_platform_render :: proc() {
	sdl.UpdateTexture(
		_sdl_canvas_texture,
		nil,
		raw_data(internal.canvas_rgba8_bytes(&internal.canvas)),
		// Bytes per row: 4 bytes per RGBA8 pixel.
		c.int(internal.canvas_size().x * 4),
	)
	sdl.RenderClear(_sdl_renderer)
	// TODO: Explain both `nil` params.
	sdl.RenderTexture(_sdl_renderer, _sdl_canvas_texture, nil, nil)
	sdl.RenderPresent(_sdl_renderer)
}

// Returns the largest whole-number scale at which the canvas fits within
// `_INITIAL_WINDOW_MAX_DISPLAY_FRACTION` of the primary display's usable area,
// but at least 1.
//
// TODO: Pick the display the window actually opens on, if it can differ from
//       the primary one.
@(private = "file")
_initial_scale :: proc(canvas_size: internal.Xy_Int) -> int {
	usable_area: sdl.Rect
	if !sdl.GetDisplayUsableBounds(sdl.GetPrimaryDisplay(), &usable_area) {
		// TODO: Use a custom logger.
		fmt.eprintln(
			"BeetPx: sdl.GetDisplayUsableBounds failed:",
			sdl.GetError(),
		)
		return _FALLBACK_INITIAL_SCALE
	}

	max_width := f64(usable_area.w) * _INITIAL_WINDOW_MAX_DISPLAY_FRACTION
	max_height := f64(usable_area.h) * _INITIAL_WINDOW_MAX_DISPLAY_FRACTION
	scale := int(
		min(max_width / f64(canvas_size.x), max_height / f64(canvas_size.y)),
	)
	return max(1, scale)
}

// Blocks until the window is closed.
//
// TODO: Check every SDL3 call here against the SDL3 docs.
@(private = "file")
_run_game_loop :: proc() {
	previous_ticks_ns := sdl.GetTicksNS()
	running := true
	for running {
		event: sdl.Event
		for sdl.PollEvent(&event) {
			if event.type == .QUIT {
				running = false
			}
		}

		current_ticks_ns := sdl.GetTicksNS()
		detla_s := f64(current_ticks_ns - previous_ticks_ns) / 1e9
		previous_ticks_ns = current_ticks_ns

		_game_loop_advance(detla_s)
	}
}
