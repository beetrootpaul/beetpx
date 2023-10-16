import { SoundUrl } from "../Assets";

export type BpxSoundSequence = {
  // will be played first
  sequence?: SoundSequenceEntry[];
  // will be player second, looped
  sequenceLooped?: SoundSequenceEntry[];
};

export type SoundSequenceEntry = [
  SoundSequenceEntrySoundMain,
  ...SoundSequenceEntrySoundAdditional[],
];

type SoundSequenceEntrySoundMain = {
  url: SoundUrl;
  durationMs?: (fullSoundDurationMs: number) => number;
};

type SoundSequenceEntrySoundAdditional = {
  url: SoundUrl;
};
