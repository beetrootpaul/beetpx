package beetpx_bpx

import "core:encoding/endian"

// Uncompressed PCM audio, read from a WAV file.
@(private)
_Wav :: struct {
	channels       : int,
	sample_rate    : int,
	bits_per_sample: int,
	// Interleaved samples: unsigned for 8 bits, signed little-endian for 16.
	data           : []u8,
}

// Reads the PCM audio from the bytes of a WAV file, without copying it. Only
// 8- and 16-bit PCM, with 1 or 2 channels, is supported.
@(private)
_wav_parse :: proc(bytes: []u8) -> (wav: _Wav, ok: bool) {
	if len(bytes) < 12 do return {}, false
	if string(bytes[0:4]) != "RIFF" || string(bytes[8:12]) != "WAVE" {
		return {}, false
	}

	has_fmt, has_data: bool
	rest := bytes[12:]
	for len(rest) >= 8 {
		chunk_id := string(rest[0:4])
		chunk_size := int(endian.unchecked_get_u32le(rest[4:8]))
		rest = rest[8:]
		// Some files declare a size larger than what is left, e.g. when
		// written by a stream which did not know the size up front.
		chunk_size = min(chunk_size, len(rest))
		chunk := rest[:chunk_size]

		switch chunk_id {
		case "fmt ":
			if len(chunk) < 16 do return {}, false
			// 1 means PCM.
			if endian.unchecked_get_u16le(chunk[0:2]) != 1 do return {}, false
			wav.channels = int(endian.unchecked_get_u16le(chunk[2:4]))
			wav.sample_rate = int(endian.unchecked_get_u32le(chunk[4:8]))
			wav.bits_per_sample = int(endian.unchecked_get_u16le(chunk[14:16]))
			has_fmt = true
		case "data":
			wav.data = chunk
			has_data = true
		}

		// Chunks are padded to an even size.
		rest = rest[min(chunk_size + chunk_size % 2, len(rest)):]
	}

	if !has_fmt || !has_data do return {}, false
	if wav.channels != 1 && wav.channels != 2 do return {}, false
	if wav.bits_per_sample != 8 && wav.bits_per_sample != 16 do return {}, false
	if wav.sample_rate <= 0 do return {}, false
	return wav, true
}

// How many frames (samples of all channels at one point in time) it has.
@(private)
_wav_frames :: proc(wav: _Wav) -> int {
	return len(wav.data) / (wav.channels * wav.bits_per_sample / 8)
}

// Returns the sample of `channel` at `frame`, from -1 to 1.
@(private)
_wav_sample :: proc(wav: _Wav, frame, channel: int) -> f32 {
	i := frame * wav.channels + channel
	if wav.bits_per_sample == 8 {
		return (f32(wav.data[i]) - 128) / 128
	}
	return f32(i16(endian.unchecked_get_u16le(wav.data[2 * i:]))) / 32768
}
