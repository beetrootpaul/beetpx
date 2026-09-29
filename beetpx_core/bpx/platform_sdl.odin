#+private file
#+vet unused-procedures
#+build darwin, linux, windows
package bpx

import "core:fmt"
import sdl "vendor:sdl3"

_INITIAL_SCALE :: 8

_sdl_renderer: ^sdl.Renderer
_sdl_canvas_texture: ^sdl.Texture

// TODO: Read SDL3 docs about everything that happens inside this proc.
// TODO: Tinker with settings passed to SDL3 in this proc.
// TODO: Review this implementation.
@(private = "package")
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
		CANVAS_WIDTH,
		CANVAS_HEIGHT,
		.INTEGER_SCALE,
	)
	sdl.SetRenderVSync(_sdl_renderer, 1)

	// `RGBA32` means the R, G, B, A bytes in this order in memory, on any
	// endianness, which is how the canvas stores its pixels.
	_sdl_canvas_texture = sdl.CreateTexture(
		_sdl_renderer,
		.RGBA32,
		.STREAMING,
		CANVAS_WIDTH,
		CANVAS_HEIGHT,
	)
	if _sdl_canvas_texture == nil {
		fmt.eprintln("BeetPx: sdl.CreateTexture failed:", sdl.GetError())
		return
	}
	defer sdl.DestroyTexture(_sdl_canvas_texture)
	sdl.SetTextureScaleMode(_sdl_canvas_texture, .NEAREST)

	// TODO: Use a custom logger.
	fmt.printfln("BeetPx (%v) started.", ODIN_OS)

	_canvas_fill_black()

	_run_game_loop()
}

// TODO: Read SDL3 docs about everything that happens inside this proc.
// TODO: Review this implementation.
@(private = "package")
_platform_render :: proc() {
	sdl.UpdateTexture(
		_sdl_canvas_texture,
		nil,
		raw_data(_canvas_rgba8_bytes()),
		// Bytes per row: 4 bytes per RGBA8 pixel.
		CANVAS_WIDTH * 4,
	)
	sdl.RenderClear(_sdl_renderer)
	// TODO: Add comments explaining both `nil` params.
	sdl.RenderTexture(_sdl_renderer, _sdl_canvas_texture, nil, nil)
	sdl.RenderPresent(_sdl_renderer)
}

// Blocks until the window is closed.
//
// TODO: Read SDL3 docs about everything that happens inside this proc.
// TODO: Review this implementation.
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
		delta_seconds := f64(current_ticks_ns - previous_ticks_ns) / 1e9
		previous_ticks_ns = current_ticks_ns

		_game_loop_advance(delta_seconds)
	}
}
