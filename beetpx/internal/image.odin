package beetpx_internal

import "core:fmt"
import "core:image/png"
import "core:slice"
import "core:strings"

@(private)
_Images_State :: struct {
	by_path: map[string]_Image,
}

// TODO: Maybe it would be better to reuse Odin's `image.Image` instead of
//       repacking into my own? Or at least keep a pointer to that original
//       image inside here as a field?

// An image decoded into RGBA8 colors, e.g. a sprite sheet.
@(private = "file")
_Image :: struct {
	pixels: [][4]u8,
	// TODO: Should we keep `int` here from the Odin's `image.Image`?
	wh    : [2]int,
}

// Decodes a PNG image and makes it available to obtain later on.
//
// Only RGBA8 PNGs are supported.
image_decode_png :: proc(path: string, png_bytes: []u8) -> (ok: bool) {
	decoded, err := png.load_from_bytes(png_bytes, {.alpha_add_if_missing})
	if err != nil {
		// TODO: Use a custom logger.
		// TODO: This logs, but should it also crash the game?
		fmt.eprintln("BeetPx: failed to decode a PNG:", path, err)
		return false
	}
	// TODO: Comment out this line and check if anything fails to prevent me
	//       from a mistake. Consider using tracking allocator.
	defer png.destroy(decoded)

	if decoded.channels != 4 || decoded.depth != 8 {
		// TODO: Use a custom logger.
		fmt.eprintln(
			"BeetPx: unsupported PNG, with channels and depth:",
			path,
			decoded.channels,
			decoded.depth,
		)
		return false
	}

	// TODO: Are we sure we can limit this to `u8`` ints?
	pixels := make([][4]u8, decoded.width * decoded.height)
	copy(slice.to_bytes(pixels), decoded.pixels.buf[:])
	// TODO: Can we make Odin compiler warn us about not every field being
	//       initialized?
	_s.images.by_path[strings.clone(path)] = {
		pixels = pixels,
		wh     = {decoded.width, decoded.height},
	}

	return true
}

image_get :: proc(path: string) -> (image: _Image, ok: bool) {
	return _s.images.by_path[path]
}
