import { Assets, SoundUrl } from "../Assets";
export declare class AudioApi {
    #private;
    get audioContext(): AudioContext;
    constructor(assets: Assets, audioContext: AudioContext);
    resumeAudioContextIfNeeded(): void;
    toggleMuteUnmute(): void;
    playSoundOnce(soundUrl: SoundUrl): void;
    playSoundLooped(soundUrl: SoundUrl, muteOnStart?: boolean): void;
    muteSound(loopedSoundUrl: SoundUrl): void;
    unmuteSound(loopedSoundUrl: SoundUrl): void;
}
