package beetpx_bpxd

import "../bpx"
import "../internal"
import "core:math/linalg"

// TODO: tests for clipping, sprite wh outside image limits, drawing outside
//       the canvas, etc. etc.

// Draws a sprite with its top-left corner at `xy`.
sprite :: proc(xy: bpx.Xy, sprite: bpx.Sprite) {
	if sprite.image_path == "" do return
	image, ok := internal.image_get(sprite.image_path)
	// TODO: Some better error handling here?
	if !ok do return

	// TODO: Introduce bpx.log or something so we can easily debug like
	//       `bpx.log(sprite)` wihtout having to `import "core:fmt"` for a quick
	//       `fmt.eprintln(sprite)`.

	c_xy_1 := bpx.u_round(xy - _s.camera_xy)
	c_xy_2 := bpx.u_round(xy - _s.camera_xy + bpx.Xy(sprite.wh))

	c_xy_limit := internal.canvas_size()
	c_xy_min_incl := linalg.max(linalg.min(c_xy_1, c_xy_2), 0)
	c_xy_max_excl := linalg.min(linalg.max(c_xy_1, c_xy_2), c_xy_limit)

	for c_y in c_xy_min_incl.y ..< c_xy_max_excl.y {
		for c_x in c_xy_min_incl.x ..< c_xy_max_excl.x {
			image_x := sprite.xy.x + c_x - c_xy_min_incl.x
			image_y := sprite.xy.y + c_y - c_xy_min_incl.y
			color := image.pixels[image_y * image.wh.x + image_x]
			// TODO: What to do with the skipped alpha?
			// TODO: Do we really use `canvas_set` with Xy/Xy_Int or we could
			//       make it always take x and y separately as the majority of
			//       usages?
			internal.canvas_set({c_x, c_y}, color.rgb)
		}
	}
}
