import { SoundUrl } from "../Assets";

export type BpxSoundSequence = {
  intro?: BpxSoundSequenceEntry[];
  loop?: BpxSoundSequenceEntry[];
};

export type BpxSoundSequenceEntry = [
  SoundSequenceEntrySoundMain,
  ...SoundSequenceEntrySoundAdditional[],
];

type SoundSequenceEntrySoundMain =
  | SoundUrl
  | {
      url: SoundUrl;
      durationMs?: (fullSoundDurationMs: number) => number;
    };

type SoundSequenceEntrySoundAdditional =
  | SoundUrl
  | {
      url: SoundUrl;
    };
