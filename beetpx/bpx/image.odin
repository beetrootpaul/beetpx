package beetpx_bpx

import "core:fmt"
import "core:image/png"
import "core:slice"

// TODO: Consider an asset loading API instead of decoding images by hand.

// An image decoded into RGB colors, e.g. a sprite sheet.
Image :: struct {
	size  : Xy_Int,
	// The image's pixels, row by row.
	pixels: []Rgb,
}

// Decodes an image from the bytes of a PNG file, e.g. one embedded with
// `#load`.
//
// The alpha channel is ignored, so every pixel is opaque. Only 8 bits per
// channel are supported. On failure, returns an empty image, which draws
// nothing.
//
// TODO: Consider adding `image_destroy`. For now, images are meant to live
//       until the game ends.
image_from_png :: proc(
	png_bytes: []u8,
) -> (
	image: Image,
	ok: bool,
) #optional_ok {
	decoded, err := png.load_from_bytes(png_bytes, {.alpha_drop_if_present})
	if err != nil {
		// TODO: Use a custom logger.
		fmt.eprintln("BeetPx: failed to decode a PNG:", err)
		return {}, false
	}
	defer png.destroy(decoded)

	if decoded.channels != 3 || decoded.depth != 8 {
		// TODO: Use a custom logger.
		fmt.eprintln(
			"BeetPx: unsupported PNG, with channels and depth:",
			decoded.channels,
			decoded.depth,
		)
		return {}, false
	}

	image.size = {decoded.width, decoded.height}
	image.pixels = make([]Rgb, decoded.width * decoded.height)
	copy(slice.to_bytes(image.pixels), decoded.pixels.buf[:])
	return image, true
}
