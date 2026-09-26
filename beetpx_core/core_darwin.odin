#+private file
package beetpx_core

import "core:fmt"
import sdl "vendor:sdl3"

_INITIAL_SCALE :: 8

@(private = "package")
_core_sdl_renderer: ^sdl.Renderer

// TODO: Read SDL3 docs about everything that happens inside this proc.
// TODO: Tinker with settings passed to SDL3 in this proc.
@(private = "package")
_core_start :: proc() {
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
		&_core_sdl_renderer,
	)
	if !ok {
		fmt.eprintln(
			"BeetPx: sdl.CreateWindowAndRenderer failed:",
			sdl.GetError(),
		)
		return
	}
	defer sdl.DestroyRenderer(_core_sdl_renderer)
	defer sdl.DestroyWindow(sdl_window)

	sdl.SetRenderLogicalPresentation(
		_core_sdl_renderer,
		CANVAS_WIDTH,
		CANVAS_HEIGHT,
		.LETTERBOX,
	)
	sdl.SetRenderVSync(_core_sdl_renderer, 1)

	// TODO: Use a custom logger.
	fmt.println("BeetPx (darwin) started.")

	_game_loop_run()
}

// TODO: Read SDL3 docs about everything that happens inside this proc.
@(private = "package")
_core_render :: proc() {
	sdl.RenderPresent(_core_sdl_renderer)
}
