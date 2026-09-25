package beetpx_core

import "color"
import "core:fmt"
import sdl "vendor:sdl3"

@(private)
_INITIAL_SCALE :: 8

@(private)
_sdl_renderer: ^sdl.Renderer

// TODO: Read SDL3 docs about everything that happens inside this proc.
// TODO: Tinker with settings passed to SDL3 in this proc.
@(private)
_platform_start :: proc() {
	if !sdl.Init({.VIDEO}) {
		fmt.eprintln("BeetPx: sdl.Init failed:", sdl.GetError())
		return
	}
	defer sdl.Quit()

	sdl_window: ^sdl.Window
	ok := sdl.CreateWindowAndRenderer(
		"BeetPx",
		CANVAS_WIDTH * _INITIAL_SCALE,
		CANVAS_HEIGHT * _INITIAL_SCALE,
		{.RESIZABLE},
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

	sdl.SetRenderLogicalPresentation(
		_sdl_renderer,
		CANVAS_WIDTH,
		CANVAS_HEIGHT,
		.LETTERBOX,
	)
	sdl.SetRenderVSync(_sdl_renderer, 1)

	// TODO: Use a custom logger.
	fmt.println("BeetPx (darwin) started.")

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
		delta_seconds := f64(current_ticks_ns - previous_ticks_ns) / 1e9
		previous_ticks_ns = current_ticks_ns

		_advance(delta_seconds)
	}
}

// TODO: Read SDL3 docs about everything that happens inside this proc.
@(private)
_platform_present :: proc() {
	sdl.RenderPresent(_sdl_renderer)
}

// TODO: Move it to core and draw pixel-by-pixel.
// TODO: Read SDL3 docs about everything that happens inside this proc.
draw_clear_canvas :: proc(color: color.Rgb) {
	sdl.SetRenderDrawColor(_sdl_renderer, color.r, color.g, color.b, 255)
	sdl.RenderClear(_sdl_renderer)
}
