import { BpxSoundUrl } from "../assets/Assets";

/**
 * TODO: docs
 */
export type BpxSoundSequence = {
  intro?: BpxSoundSequenceEntry[];
  loop?: BpxSoundSequenceEntry[];
};

/**
 * TODO: docs
 */
export type BpxSoundSequenceEntry = [
  SoundSequenceEntrySoundMain,
  ...SoundSequenceEntrySoundAdditional[],
];

/**
 * TODO: docs
 */
type SoundSequenceEntrySoundMain =
  | BpxSoundUrl
  | {
      url: BpxSoundUrl;
      durationMs?: (fullSoundDurationMs: number) => number;
    };

/**
 * TODO: docs
 */
type SoundSequenceEntrySoundAdditional =
  | BpxSoundUrl
  | {
      url: BpxSoundUrl;
    };
