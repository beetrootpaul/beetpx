package brand_cover

import "core:flags"
import "core:fmt"
import "core:image"
import "core:image/png"
import "core:os"
import "core:strings"
import stbi "vendor:stb/image"

// Brands a game cover: puts the BeetPx logo in its top-right corner.

@(private = "file")
_LOGO_PNG :: #load("beetpx_logo.png")

@(private = "file")
_Options :: struct {
	input : string `args:"pos=0,required" usage:"Input PNG file."`,
	output: string `args:"pos=1,required" usage:"Output PNG file."`,
	scale : int `usage:"Logo scale. Default: picked from the input size."`,
}

main :: proc() {
	opts: _Options
	flags.parse_or_exit(&opts, os.args, .Odin)

	if err := _brand_cover(opts); err != "" {
		fmt.eprintln("Error:", err)
		os.exit(1)
	}
}

@(private = "file")
_brand_cover :: proc(opts: _Options) -> (err: string) {
	load_options := image.Options{.alpha_add_if_missing}

	cover, cover_err := png.load(opts.input, load_options)
	if cover_err != nil {
		return fmt.tprintf("cannot load '%s': %v", opts.input, cover_err)
	}
	defer png.destroy(cover)
	if cover.depth != 8 {
		return fmt.tprintf("'%s' is not 8-bit per channel", opts.input)
	}

	logo, logo_err := png.load(_LOGO_PNG, load_options)
	if logo_err != nil {
		return fmt.tprintf("cannot load the logo: %v", logo_err)
	}
	defer png.destroy(logo)

	// By default, the logo takes about 1/6 of the shorter cover side, and is
	// scaled by an integer, to keep its pixels crisp.
	scale := opts.scale
	if scale <= 0 {
		scale = max(1, min(cover.width, cover.height) / 6 / logo.height)
	}
	// The margin from the cover edges is 2 logo pixels.
	margin := 2 * scale

	logo_w := logo.width * scale
	logo_h := logo.height * scale
	if logo_w + margin > cover.width || logo_h + margin > cover.height {
		return fmt.tprintf(
			"logo at scale %d does not fit in %dx%d",
			scale,
			cover.width,
			cover.height,
		)
	}

	x_min := cover.width - margin - logo_w
	y_min := margin
	cover_px := cover.pixels.buf[:]
	logo_px := logo.pixels.buf[:]
	for y in 0 ..< logo_h {
		for x in 0 ..< logo_w {
			src := 4 * ((y / scale) * logo.width + x / scale)
			dst := 4 * ((y_min + y) * cover.width + x_min + x)
			_blend(cover_px[dst:][:4], logo_px[src:][:4])
		}
	}

	written := stbi.write_png(
		strings.clone_to_cstring(opts.output, context.temp_allocator),
		i32(cover.width),
		i32(cover.height),
		4,
		raw_data(cover_px),
		i32(4 * cover.width),
	)
	if written == 0 {
		return fmt.tprintf("cannot write '%s'", opts.output)
	}
	return ""
}

// Draws the `src` RGBA pixel over the `dst` one.
@(private = "file")
_blend :: proc(dst: []u8, src: []u8) {
	a := u32(src[3])
	for i in 0 ..< 3 {
		dst[i] = u8((u32(src[i]) * a + u32(dst[i]) * (255 - a)) / 255)
	}
	dst[3] = u8(a + u32(dst[3]) * (255 - a) / 255)
}
