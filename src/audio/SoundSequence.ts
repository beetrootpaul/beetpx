import { BpxSoundUrl } from "../Assets";

export type BpxSoundSequence = {
  intro?: BpxSoundSequenceEntry[];
  loop?: BpxSoundSequenceEntry[];
};

export type BpxSoundSequenceEntry = [
  SoundSequenceEntrySoundMain,
  ...SoundSequenceEntrySoundAdditional[],
];

type SoundSequenceEntrySoundMain =
  | BpxSoundUrl
  | {
      url: BpxSoundUrl;
      durationMs?: (fullSoundDurationMs: number) => number;
    };

type SoundSequenceEntrySoundAdditional =
  | BpxSoundUrl
  | {
      url: BpxSoundUrl;
    };
