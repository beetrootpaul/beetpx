import { Assets, SoundUrl } from "../Assets";
import { SoundSequence } from "./SoundSequence";
export declare class AudioApi {
    #private;
    get audioContext(): AudioContext;
    get globalGainNode(): GainNode;
    constructor(assets: Assets, audioContext: AudioContext);
    resumeAudioContextIfNeeded(): void;
    toggleMuteUnmute(): void;
    playSoundOnce(soundUrl: SoundUrl): void;
    playSoundLooped(soundUrl: SoundUrl, muteOnStart?: boolean): void;
    playSoundSequence(soundSequence: SoundSequence): void;
    muteSound(loopedSoundUrl: SoundUrl): void;
    unmuteSound(loopedSoundUrl: SoundUrl): void;
}
