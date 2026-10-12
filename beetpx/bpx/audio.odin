package beetpx_bpx

import "core:fmt"

// TODO: Global mute and unmute, stop, pause and resume of a playback.
// TODO: Customizable fade durations.

// A sound which can be played. Made with `sound_from_wav`.
Sound :: distinct u32

// An identifier of a played audio. Can be used to e.g. mute a specific sound.
Audio_Playback_Id :: distinct u32

@(private = "file")
_MAX_SOUNDS :: 64

// Sound `n` is at index `n - 1`, so that the zero value of `Sound` is not a
// valid sound.
@(private)
_sounds: [_MAX_SOUNDS]_Wav
@(private = "file")
_sounds_count: int

// Starts from 1, so that the zero value of `Audio_Playback_Id` is not a valid
// playback.
@(private = "file")
_next_playback_id: Audio_Playback_Id = 1

// A short fade in and out when muting and unmuting, in order to avoid audio
// artifacts that would happen on an instant volume change.
@(private)
_MUTE_UNMUTE_FADE_S :: 0.1

// Makes a sound from the bytes of a WAV file, e.g. embedded with `#load`.
// Only uncompressed 8- or 16-bit PCM, mono or stereo, is supported.
//
// The bytes are not copied, so they have to stay valid for as long as the
// game runs.
//
// Returns the zero value of `Sound` if the bytes cannot be read. Playing such
// a sound does nothing.
sound_from_wav :: proc(wav_bytes: []u8) -> Sound {
	wav, ok := _wav_parse(wav_bytes)
	if !ok {
		// TODO: Use a custom logger.
		fmt.eprintln("BeetPx: unsupported or invalid WAV data.")
		return {}
	}
	if _sounds_count >= _MAX_SOUNDS {
		// TODO: Use a custom logger.
		fmt.eprintln("BeetPx: too many sounds, max is", _MAX_SOUNDS)
		return {}
	}

	_sounds[_sounds_count] = wav
	_sounds_count += 1
	sound := Sound(_sounds_count)
	_platform_audio_add_sound(sound, wav)
	return sound
}

// Starts to play a given sound, once.
//
// Returns an `Audio_Playback_Id` of the started playback. Can be later used
// to e.g. mute this playback.
start_playback :: proc(
	sound: Sound,
	mute_on_start := false,
) -> Audio_Playback_Id {
	return _start_playback(sound, false, mute_on_start)
}

// Starts to play a given sound, looped.
//
// Returns an `Audio_Playback_Id` of the started playback. Can be later used
// to e.g. mute this playback.
start_playback_looped :: proc(
	sound: Sound,
	mute_on_start := false,
) -> Audio_Playback_Id {
	return _start_playback(sound, true, mute_on_start)
}

// Mutes a given playback, with a short fade out.
mute_playback :: proc(playback_id: Audio_Playback_Id) {
	_platform_audio_set_playback_muted(playback_id, true)
}

// Un-mutes a given playback, with a short fade in.
unmute_playback :: proc(playback_id: Audio_Playback_Id) {
	_platform_audio_set_playback_muted(playback_id, false)
}

@(private = "file")
_start_playback :: proc(
	sound: Sound,
	looped, muted: bool,
) -> Audio_Playback_Id {
	if sound == 0 || int(sound) > _sounds_count do return {}

	playback_id := _next_playback_id
	_next_playback_id += 1
	_platform_audio_start_playback(playback_id, sound, looped, muted)
	return playback_id
}
