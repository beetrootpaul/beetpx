package beetpx_bpx

// Implemented in JavaScript by `beetpx.js`, like the procs in
// `platform_js.odin`.
foreign import beetpx_js_audio "beetpx"

@(default_calling_convention = "contextless")
@(private = "file")
foreign beetpx_js_audio {
	// Makes the audio clip playable, from its interleaved PCM samples.
	@(link_name = "audio_add_clip")
	_audio_add_clip :: proc(clip: Audio_Clip, data: []u8, channels, sample_rate, bits_per_sample: int) ---

	@(link_name = "audio_start_sound")
	_audio_start_sound :: proc(sound: Sound, clip: Audio_Clip, looped, muted: bool) ---

	@(link_name = "audio_set_sound_muted")
	_audio_set_sound_muted :: proc(sound: Sound, muted: bool, fade_s: f64) ---
}

@(private)
_platform_audio_add_clip :: proc(clip: Audio_Clip, wav: _Wav) {
	_audio_add_clip(
		clip,
		wav.data,
		wav.channels,
		wav.sample_rate,
		wav.bits_per_sample,
	)
}

@(private)
_platform_audio_start_sound :: proc(
	sound: Sound,
	clip: Audio_Clip,
	looped, muted: bool,
) {
	_audio_start_sound(sound, clip, looped, muted)
}

@(private)
_platform_audio_set_sound_muted :: proc(sound: Sound, muted: bool) {
	_audio_set_sound_muted(sound, muted, _MUTE_UNMUTE_FADE_S)
}
