package beetpx_bpx

import "core:fmt"

// TODO: Global mute and unmute, stop, pause and resume of a sound.
// TODO: Customizable fade durations.

// Audio data which can be played. Made with `audio_clip_from_wav`.
Audio_Clip :: distinct u32

// One playing instance of an `Audio_Clip`. Can be used to e.g. mute it. Stays
// safe to use after it ends: calls with it then do nothing.
Sound :: distinct u32

@(private = "file")
_MAX_AUDIO_CLIPS :: 64

// Audio clip `n` is at index `n - 1`, so that the zero value of `Audio_Clip`
// is not a valid audio clip.
@(private)
_audio_clips: [_MAX_AUDIO_CLIPS]_Wav
@(private = "file")
_audio_clips_count: int

// Starts from 1, so that the zero value of `Sound` is not a valid sound.
@(private = "file")
_next_sound: Sound = 1

// A short fade in and out when muting and unmuting, in order to avoid audio
// artifacts that would happen on an instant volume change.
@(private)
_MUTE_UNMUTE_FADE_S :: 0.1

// Makes an audio clip from the bytes of a WAV file, e.g. embedded with
// `#load`. Only uncompressed 8- or 16-bit PCM, mono or stereo, is supported.
//
// The bytes are not copied, so they have to stay valid for as long as the
// game runs.
//
// Returns the zero value of `Audio_Clip` if the bytes cannot be read. Playing
// such an audio clip does nothing.
audio_clip_from_wav :: proc(wav_bytes: []u8) -> Audio_Clip {
	wav, ok := _wav_parse(wav_bytes)
	if !ok {
		// TODO: Use a custom logger.
		fmt.eprintln("BeetPx: unsupported or invalid WAV data.")
		return {}
	}
	if _audio_clips_count >= _MAX_AUDIO_CLIPS {
		// TODO: Use a custom logger.
		fmt.eprintln("BeetPx: too many audio clips, max is", _MAX_AUDIO_CLIPS)
		return {}
	}

	_audio_clips[_audio_clips_count] = wav
	_audio_clips_count += 1
	clip := Audio_Clip(_audio_clips_count)
	_platform_audio_add_clip(clip, wav)
	return clip
}

// Starts to play a given audio clip, once.
//
// Returns the started `Sound`. Can be later used to e.g. mute it.
play_audio_clip :: proc(clip: Audio_Clip, mute_on_start := false) -> Sound {
	return _play_audio_clip(clip, false, mute_on_start)
}

// Starts to play a given audio clip, looped.
//
// Returns the started `Sound`. Can be later used to e.g. mute it.
play_audio_clip_looped :: proc(
	clip: Audio_Clip,
	mute_on_start := false,
) -> Sound {
	return _play_audio_clip(clip, true, mute_on_start)
}

// Mutes a given sound, with a short fade out.
mute_sound :: proc(sound: Sound) {
	_platform_audio_set_sound_muted(sound, true)
}

// Un-mutes a given sound, with a short fade in.
unmute_sound :: proc(sound: Sound) {
	_platform_audio_set_sound_muted(sound, false)
}

@(private = "file")
_play_audio_clip :: proc(clip: Audio_Clip, looped, muted: bool) -> Sound {
	if clip == 0 || int(clip) > _audio_clips_count do return {}

	sound := _next_sound
	_next_sound += 1
	_platform_audio_start_sound(sound, clip, looped, muted)
	return sound
}
