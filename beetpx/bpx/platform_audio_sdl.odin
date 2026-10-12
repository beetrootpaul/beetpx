#+build darwin, linux, windows
package beetpx_bpx

import "base:runtime"
import "core:c"
import "core:fmt"
import sdl "vendor:sdl3"

// Playbacks are mixed into a single stream of this format. SDL converts it to
// whatever the audio device needs.
@(private = "file")
_OUTPUT_SAMPLE_RATE :: 48_000
@(private = "file")
_OUTPUT_CHANNELS :: 2

// How many playbacks can play at the same time.
@(private = "file")
_MAX_VOICES :: 16

@(private = "file")
_Voice :: struct {
	playback_id: Audio_Playback_Id,
	sound      : Sound,
	looped     : bool,
	// In frames of the sound, which may have a different sample rate than
	// the output.
	position   : f64,
	gain       : f32,
	target_gain: f32,
}

// Shared by the game and the audio thread. `nil` before the audio device is
// opened, when there is no audio thread yet.
@(private = "file")
_audio_stream: ^sdl.AudioStream

// A voice with `playback_id` of 0 is free.
@(private = "file")
_voices: [_MAX_VOICES]_Voice

// Opens the audio device. If that fails, the game runs without sound.
@(private)
_audio_device_open :: proc() {
	if !sdl.InitSubSystem({.AUDIO}) {
		fmt.eprintln(
			"BeetPx: sdl.InitSubSystem(AUDIO) failed:",
			sdl.GetError(),
		)
		return
	}

	spec := sdl.AudioSpec {
		format   = .F32,
		channels = _OUTPUT_CHANNELS,
		freq     = _OUTPUT_SAMPLE_RATE,
	}
	stream := sdl.OpenAudioDeviceStream(
		sdl.AUDIO_DEVICE_DEFAULT_PLAYBACK,
		&spec,
		_audio_stream_callback,
		nil,
	)
	if stream == nil {
		fmt.eprintln(
			"BeetPx: sdl.OpenAudioDeviceStream failed:",
			sdl.GetError(),
		)
		return
	}
	_audio_stream = stream
	// The device starts paused.
	sdl.ResumeAudioStreamDevice(_audio_stream)
}

@(private)
_audio_device_close :: proc() {
	if _audio_stream == nil do return
	sdl.DestroyAudioStream(_audio_stream)
	_audio_stream = nil
}

@(private)
_platform_audio_add_sound :: proc(_: Sound, _: _Wav) {
	// The mixer reads `_sounds` directly.
}

@(private)
_platform_audio_start_playback :: proc(
	playback_id: Audio_Playback_Id,
	sound: Sound,
	looped, muted: bool,
) {
	_lock()
	defer _unlock()

	for &v in _voices {
		if v.playback_id != 0 do continue
		v = {
			playback_id = playback_id,
			sound       = sound,
			looped      = looped,
			gain        = muted ? 0 : 1,
			target_gain = muted ? 0 : 1,
		}
		return
	}
	// TODO: Use a custom logger.
	fmt.eprintln("BeetPx: too many sounds played at once, max is", _MAX_VOICES)
}

@(private)
_platform_audio_set_playback_muted :: proc(
	playback_id: Audio_Playback_Id,
	muted: bool,
) {
	if playback_id == 0 do return

	_lock()
	defer _unlock()

	for &v in _voices {
		if v.playback_id == playback_id {
			v.target_gain = muted ? 0 : 1
			return
		}
	}
}

// Guards `_voices` against the audio thread. SDL calls
// `_audio_stream_callback` with the stream locked.
@(private = "file")
_lock :: proc() {
	if _audio_stream != nil do sdl.LockAudioStream(_audio_stream)
}

@(private = "file")
_unlock :: proc() {
	if _audio_stream != nil do sdl.UnlockAudioStream(_audio_stream)
}

// Called by SDL on the audio thread, whenever the device needs more data.
@(private = "file")
_audio_stream_callback :: proc "c" (
	_: rawptr,
	stream: ^sdl.AudioStream,
	additional_amount, _: c.int,
) {
	context = runtime.default_context()

	buffer: [512][_OUTPUT_CHANNELS]f32
	frames_left := int(additional_amount) / size_of(buffer[0])
	for frames_left > 0 {
		frames := buffer[:min(frames_left, len(buffer))]
		_mix(frames)
		sdl.PutAudioStreamData(
			stream,
			raw_data(frames),
			c.int(len(frames) * size_of(frames[0])),
		)
		frames_left -= len(frames)
	}
}

// Mixes all voices into `out`, and advances them.
@(private = "file")
_mix :: proc(out: [][_OUTPUT_CHANNELS]f32) {
	gain_step := f32(1.0 / (_MUTE_UNMUTE_FADE_S * _OUTPUT_SAMPLE_RATE))

	for &frame in out do frame = 0

	for &v in _voices {
		if v.playback_id == 0 do continue

		wav := _sounds[v.sound - 1]
		frames := _wav_frames(wav)
		if frames == 0 {
			v = {}
			continue
		}
		step := f64(wav.sample_rate) / _OUTPUT_SAMPLE_RATE

		for &frame in out {
			if v.position >= f64(frames) {
				if !v.looped {
					v = {}
					break
				}
				v.position -= f64(frames)
			}

			if v.gain < v.target_gain {
				v.gain = min(v.gain + gain_step, v.target_gain)
			} else if v.gain > v.target_gain {
				v.gain = max(v.gain - gain_step, v.target_gain)
			}

			// Linear interpolation between the two nearest frames of the
			// sound.
			i := int(v.position)
			next_i := i + 1
			if next_i >= frames do next_i = v.looped ? 0 : i
			t := f32(v.position - f64(i))

			for ch in 0 ..< _OUTPUT_CHANNELS {
				// A mono sound plays on both channels.
				wav_ch := min(ch, wav.channels - 1)
				a := _wav_sample(wav, i, wav_ch)
				b := _wav_sample(wav, next_i, wav_ch)
				frame[ch] += v.gain * (a + (b - a) * t)
			}

			v.position += step
		}
	}

	for &frame in out {
		for &sample in frame do sample = clamp(sample, -1, 1)
	}
}
