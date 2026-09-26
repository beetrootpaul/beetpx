// TODO: Rework the package structure.
package beetpx_core

import "beetpx_core:color"
import sdl "vendor:sdl3"

// TODO: Draw pixel-by-pixel and do not rely on SDL renderer, then move to separate package.
// TODO: Read SDL3 docs about everything that happens inside this proc.
draw_clear_canvas :: proc(color: color.Rgb) {
	sdl.SetRenderDrawColor(_core_sdl_renderer, color.r, color.g, color.b, 255)
	sdl.RenderClear(_core_sdl_renderer)
}
