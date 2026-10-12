package beetpx_bpx

// Implemented in JavaScript by `beetpx.js`, like the procs in
// `platform_js.odin`.
foreign import beetpx_js_audio "beetpx"

@(default_calling_convention = "contextless")
@(private = "file")
foreign beetpx_js_audio {
	// Makes the sound playable, from its interleaved PCM samples.
	@(link_name = "audio_add_sound")
	_audio_add_sound :: proc(sound: Sound, data: []u8, channels, sample_rate, bits_per_sample: int) ---

	@(link_name = "audio_start_playback")
	_audio_start_playback :: proc(playback_id: Audio_Playback_Id, sound: Sound, looped, muted: bool) ---

	@(link_name = "audio_set_playback_muted")
	_audio_set_playback_muted :: proc(playback_id: Audio_Playback_Id, muted: bool, fade_s: f64) ---
}

@(private)
_platform_audio_add_sound :: proc(sound: Sound, wav: _Wav) {
	_audio_add_sound(
		sound,
		wav.data,
		wav.channels,
		wav.sample_rate,
		wav.bits_per_sample,
	)
}

@(private)
_platform_audio_start_playback :: proc(
	playback_id: Audio_Playback_Id,
	sound: Sound,
	looped, muted: bool,
) {
	_audio_start_playback(playback_id, sound, looped, muted)
}

@(private)
_platform_audio_set_playback_muted :: proc(
	playback_id: Audio_Playback_Id,
	muted: bool,
) {
	_audio_set_playback_muted(playback_id, muted, _MUTE_UNMUTE_FADE_S)
}
