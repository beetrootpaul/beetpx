package brand_cover

import "core:bytes"
import "core:hash"
import "core:image"

// Encodes an 8-bit RGBA image as PNG.
//
// The image data is not compressed (it uses "stored" deflate blocks), which
// keeps this encoder short at the cost of bigger files.
@(private)
_png_encode :: proc(
	img: ^image.Image,
	allocator := context.allocator,
) -> []u8 {
	assert(img.channels == 4 && img.depth == 8)

	out: bytes.Buffer
	bytes.buffer_init_allocator(&out, 0, 0, allocator)

	bytes.buffer_write(&out, {0x89, 'P', 'N', 'G', '\r', '\n', 0x1a, '\n'})

	ihdr: [13]u8
	_put_u32be(ihdr[0:], u32(img.width))
	_put_u32be(ihdr[4:], u32(img.height))
	// Bit depth 8, color type RGBA, default compression, filter, interlace.
	ihdr[8] = 8
	ihdr[9] = 6
	_write_chunk(&out, "IHDR", ihdr[:])

	// Each row starts with a filter type byte. 0 means no filter.
	row_len := 4 * img.width
	raw := make([]u8, img.height * (1 + row_len), context.temp_allocator)
	for y in 0 ..< img.height {
		copy(
			raw[y * (1 + row_len) + 1:],
			img.pixels.buf[y * row_len:][:row_len],
		)
	}

	// A zlib stream of stored deflate blocks, up to 65535 bytes each.
	zlib: bytes.Buffer
	bytes.buffer_init_allocator(&zlib, 0, 0, context.temp_allocator)
	bytes.buffer_write(&zlib, {0x78, 0x01})
	rest := raw
	for {
		n := min(len(rest), 0xffff)
		is_final := n == len(rest)
		header: [5]u8 = {
			is_final ? 1 : 0,
			u8(n),
			u8(n >> 8),
			~u8(n),
			~u8(n >> 8),
		}
		bytes.buffer_write(&zlib, header[:])
		bytes.buffer_write(&zlib, rest[:n])
		rest = rest[n:]
		if is_final {
			break
		}
	}
	adler: [4]u8
	_put_u32be(adler[:], hash.adler32(raw))
	bytes.buffer_write(&zlib, adler[:])
	_write_chunk(&out, "IDAT", bytes.buffer_to_bytes(&zlib))

	_write_chunk(&out, "IEND", {})

	return bytes.buffer_to_bytes(&out)
}

@(private = "file")
_write_chunk :: proc(out: ^bytes.Buffer, type: string, data: []u8) {
	length: [4]u8
	_put_u32be(length[:], u32(len(data)))
	bytes.buffer_write(out, length[:])

	start := bytes.buffer_length(out)
	bytes.buffer_write_string(out, type)
	bytes.buffer_write(out, data)

	crc: [4]u8
	_put_u32be(crc[:], hash.crc32(out.buf[start:]))
	bytes.buffer_write(out, crc[:])
}

@(private = "file")
_put_u32be :: proc(dst: []u8, value: u32) {
	dst[0] = u8(value >> 24)
	dst[1] = u8(value >> 16)
	dst[2] = u8(value >> 8)
	dst[3] = u8(value)
}
