import { BpxSoundUrl } from "../assets/Assets";

/**
 * A definition of a sequence of sounds to be played. A typical use case would be
 * to define a music which consist of an intro phase, then loops indefinitely. Another
 * use case is to recreate the music composed in PICO-8 – it usually is built from
 * many short samples, tied together. Moreover, the `BpxSoundSequence` allows to
 * crop the sample, which might be useful for a PICO-8 music composed of samples
 * shorter than default 32 bits, but exported as 33-bits long.
 *
 * @example
 * ```ts
 *  const halfDuration = (fullSoundDurationMs: number) => fullSoundDurationMs * 16 / 32;
 *  $.startPlaybackSequence({
 *    intro: [
 *      [{ url: "intro1Melody.flac", durationMs: halfDuration }],
 *      [{ url: "intro2Melody.flac", durationMs: halfDuration }, { url: "intro2Bass.flac" }],
 *    ],
 *    loop: [
 *      ["loop1Melody.flac", "loop1Bass.flac"],
 *      ["loop2Melody.flac", "loop2Bass.flac"],
 *      ["loop3Melody.flac", "loop3Bass.flac"],
 *    ],
 *  });
 * ```
 *
 * @category Audio
 */
export type BpxSoundSequence = {
  intro?: BpxSoundSequenceEntry[];
  loop?: BpxSoundSequenceEntry[];
};

/**
 * @see {@link BpxSoundSequence}
 *
 * @category Audio
 */
export type BpxSoundSequenceEntry = [
  BpxSoundSequenceEntrySoundMain,
  ...BpxSoundSequenceEntrySoundAdditional[],
];

/**
 * @see {@link BpxSoundSequence}
 *
 * @category Audio
 */
export type BpxSoundSequenceEntrySoundMain =
  | BpxSoundUrl
  | {
      url: BpxSoundUrl;
      durationMs?: (fullSoundDurationMs: number) => number;
    };

/**
 * @see {@link BpxSoundSequence}
 *
 * @category Audio
 */
export type BpxSoundSequenceEntrySoundAdditional =
  | BpxSoundUrl
  | {
      url: BpxSoundUrl;
    };
