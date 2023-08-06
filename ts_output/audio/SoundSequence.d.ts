import { SoundUrl } from "../Assets";
export type SoundSequence = {
    sequence?: SoundSequenceEntry[];
    sequenceLooped?: SoundSequenceEntry[];
};
export type SoundSequenceEntry = [
    SoundSequenceEntrySoundMain,
    ...SoundSequenceEntrySoundAdditional[]
];
type SoundSequenceEntrySoundMain = {
    url: SoundUrl;
    durationMs: (fullSoundDurationMs: number) => number;
};
type SoundSequenceEntrySoundAdditional = {
    url: SoundUrl;
};
export {};
