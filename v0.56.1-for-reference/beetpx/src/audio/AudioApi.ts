import { Assets, BpxSoundUrl } from "../assets/Assets";
import { HtmlTemplate } from "../HtmlTemplate";
import { Logger } from "../logger/Logger";
import { ScopedLocaleStorage } from "../storage/ScopedLocaleStorage";
import { AudioHelpers } from "./AudioHelpers";
import { AudioPlayback, type BpxAudioPlaybackId } from "./AudioPlayback";
import { AudioPlaybackLooped } from "./AudioPlaybackLooped";
import { AudioPlaybackOnce } from "./AudioPlaybackOnce";
import { AudioPlaybackSequence } from "./AudioPlaybackSequence";
import { BpxSoundSequence } from "./SoundSequence";

export class AudioApi {
  static readonly #storageMuteUnmuteKey = "audio_api__muted";
  static readonly #storageMuteUnmuteTrue = "yes";

  // We use a short fade in/out when muting/unmuting in order to avoid some
  //   of audio artifacts that would happen on a instant volume change.
  static readonly muteUnmuteDefaultFadeMillis = 100;

  readonly #assets: Assets;

  readonly #audioContext: AudioContext;
  readonly #globalGainNode: GainNode;

  readonly #playbacks: Map<BpxAudioPlaybackId, AudioPlayback> = new Map();

  #isMuted: boolean;

  constructor(assets: Assets, audioContext: AudioContext) {
    this.#assets = assets;
    this.#audioContext = audioContext;

    this.#isMuted = this.#loadStoredGlobalMuteUnmuteState();
    HtmlTemplate.updateMutedClass(this.#isMuted);

    this.#globalGainNode = this.#audioContext.createGain();
    this.#globalGainNode.gain.value = this.#isMuted ? 0 : 1;
    this.#globalGainNode.connect(this.#audioContext.destination);
  }

  restart(): void {
    this.#stopAllPlaybacks();
    this.#playbacks.clear();
  }

  // In some browsers audio should start in result of user interaction (e.g. button click).
  // Since we cannot assure it for every game setup, let' expose a function which tries to
  // resume the AudioContext and call it on every user interaction detected by this framework.
  async tryToResumeAudioContextSuspendedByBrowserForSecurityReasons(): Promise<boolean> {
    Logger.debugBeetPx(
      "AudioApi.tryToResumeAudioContextSuspendedByBrowserForSecurityReasons",
    );

    if (this.#audioContext.state === "running") {
      Logger.debugBeetPx("Audio Context is already running");
      return Promise.resolve(true);
    }

    return this.#audioContext
      .resume()
      .then(() => {
        Logger.debugBeetPx("Audio Context got resumed");
        return true;
      })
      .catch(err => {
        Logger.errorBeetPx(err);
        return false;
      });
  }

  startPlayback(
    soundUrl: BpxSoundUrl,
    opts?: {
      muteOnStart?: boolean;
      onGamePause?: "pause" | "mute" | "ignore";
    },
  ): BpxAudioPlaybackId {
    opts ??= {};
    opts.muteOnStart ??= false;
    opts.onGamePause ??= "pause";

    Logger.debugBeetPx(
      `AudioApi.startPlayback (muteOnStart: ${opts.muteOnStart}, onGamePause: ${opts.onGamePause})`,
    );

    const playback = new AudioPlaybackOnce(soundUrl, {
      assets: this.#assets,
      audioContext: this.#audioContext,
      target: this.#globalGainNode,
      muteOnStart: opts.muteOnStart,
      onGamePause: opts.onGamePause,
      onEnded: () => {
        Logger.debugBeetPx(`AudioApi: deleting playback ${playback.id}`);
        this.#playbacks.delete(playback.id);
      },
    });
    this.#playbacks.set(playback.id, playback);

    return playback.id;
  }

  startPlaybackLooped(
    soundUrl: BpxSoundUrl,
    opts?: {
      muteOnStart?: boolean;
      onGamePause?: "pause" | "mute" | "ignore";
    },
  ): BpxAudioPlaybackId {
    opts ??= {};
    opts.muteOnStart ??= false;
    opts.onGamePause ??= "pause";

    Logger.debugBeetPx(
      `AudioApi.startPlaybackLooped (muteOnStart: ${opts.muteOnStart}, onGamePause: ${opts.onGamePause})`,
    );

    const playback = new AudioPlaybackLooped(soundUrl, {
      assets: this.#assets,
      audioContext: this.#audioContext,
      target: this.#globalGainNode,
      muteOnStart: opts.muteOnStart,
      onGamePause: opts.onGamePause,
      onEnded: () => {
        Logger.debugBeetPx(`AudioApi: deleting playback ${playback.id}`);
        this.#playbacks.delete(playback.id);
      },
    });
    this.#playbacks.set(playback.id, playback);

    return playback.id;
  }

  startPlaybackSequence(
    soundSequence: BpxSoundSequence,
    opts?: {
      muteOnStart?: boolean;
      onGamePause?: "pause" | "mute" | "ignore";
    },
  ): BpxAudioPlaybackId {
    opts ??= {};
    opts.muteOnStart ??= false;
    opts.onGamePause ??= "pause";

    Logger.debugBeetPx(
      `AudioApi.startPlaybackSequence (muteOnStart: ${opts.muteOnStart}, onGamePause: ${opts.onGamePause})`,
    );

    const playback = new AudioPlaybackSequence(soundSequence, {
      assets: this.#assets,
      audioContext: this.#audioContext,
      target: this.#globalGainNode,
      muteOnStart: opts.muteOnStart,
      onGamePause: opts.onGamePause,
      onEnded: () => {
        Logger.debugBeetPx(`AudioApi: deleting playback ${playback.id}`);
        this.#playbacks.delete(playback.id);
      },
    });
    this.#playbacks.set(playback.id, playback);

    return playback.id;
  }

  isAudioMuted(): boolean {
    return this.#isMuted;
  }

  muteAudio(opts?: { fadeOutMillis?: number }): void {
    opts ??= {};
    Logger.debugBeetPx(
      `AudioApi.muteAudio (fadeOutMillis: ${opts.fadeOutMillis})`,
    );

    if (this.#isMuted) return;

    this.#storeGlobalMuteUnmuteState(true);
    this.#isMuted = true;
    HtmlTemplate.updateMutedClass(this.#isMuted);

    AudioHelpers.muteGain(
      this.#globalGainNode,
      this.#audioContext.currentTime,
      opts.fadeOutMillis ?? AudioApi.muteUnmuteDefaultFadeMillis,
    );
  }

  unmuteAudio(opts?: { fadeInMillis?: number }): void {
    opts ??= {};
    Logger.debugBeetPx(
      `AudioApi.unmuteAudio (fadeInMillis: ${opts.fadeInMillis})`,
    );

    if (!this.#isMuted) return;

    this.#storeGlobalMuteUnmuteState(false);
    this.#isMuted = false;
    HtmlTemplate.updateMutedClass(this.#isMuted);

    AudioHelpers.unmuteGain(
      this.#globalGainNode,
      this.#audioContext.currentTime,
      opts.fadeInMillis ?? AudioApi.muteUnmuteDefaultFadeMillis,
    );
  }

  mutePlayback(
    playbackId: BpxAudioPlaybackId,
    opts?: { fadeOutMillis?: number },
  ): void {
    opts ??= {};
    Logger.debugBeetPx(
      `AudioApi.mutePlayback (fadeOutMillis: ${opts.fadeOutMillis})`,
    );

    this.#playbacks
      .get(playbackId)
      ?.mute(opts.fadeOutMillis ?? AudioApi.muteUnmuteDefaultFadeMillis);
  }

  unmutePlayback(
    playbackId: BpxAudioPlaybackId,
    opts?: { fadeInMillis?: number },
  ): void {
    opts ??= {};
    Logger.debugBeetPx(
      `AudioApi.unmutePlayback (fadeInMillis: ${opts.fadeInMillis})`,
    );

    this.#playbacks
      .get(playbackId)
      ?.unmute(opts.fadeInMillis ?? AudioApi.muteUnmuteDefaultFadeMillis);
  }

  #stopAllPlaybacks(opts?: { fadeOutMillis?: number }): void {
    opts ??= {};
    Logger.debugBeetPx(
      `AudioApi.#stopAllPlaybacks (fadeOutMillis: ${opts.fadeOutMillis})`,
    );

    for (const playback of this.#playbacks.values()) {
      playback.stop(
        this.#isMuted
          ? 0
          : (opts.fadeOutMillis ?? AudioApi.muteUnmuteDefaultFadeMillis),
      );
    }
  }

  stopPlayback(
    playbackId: BpxAudioPlaybackId,
    opts?: { fadeOutMillis?: number },
  ): void {
    opts ??= {};
    Logger.debugBeetPx(
      `AudioApi.stopPlayback (fadeOutMillis: ${opts.fadeOutMillis})`,
    );

    this.#playbacks
      .get(playbackId)
      ?.stop(
        this.#isMuted
          ? 0
          : (opts.fadeOutMillis ?? AudioApi.muteUnmuteDefaultFadeMillis),
      );
  }

  pausePlayback(playbackId: BpxAudioPlaybackId): void {
    Logger.debugBeetPx(`AudioApi.pausePlayback`);

    this.#playbacks.get(playbackId)?.pause();
  }

  resumePlayback(playbackId: BpxAudioPlaybackId): void {
    Logger.debugBeetPx(`AudioApi.resumePlayback`);

    this.#playbacks.get(playbackId)?.resume();
  }

  #loadStoredGlobalMuteUnmuteState(): boolean {
    return (
      ScopedLocaleStorage.getItem(AudioApi.#storageMuteUnmuteKey) ===
      AudioApi.#storageMuteUnmuteTrue
    );
  }

  #storeGlobalMuteUnmuteState(muted: boolean): void {
    if (muted) {
      ScopedLocaleStorage.setItem(
        AudioApi.#storageMuteUnmuteKey,
        AudioApi.#storageMuteUnmuteTrue,
      );
    } else {
      ScopedLocaleStorage.removeItem(AudioApi.#storageMuteUnmuteKey);
    }
  }

  getAudioContext(): AudioContext {
    return this.#audioContext;
  }

  getGlobalGainNode(): GainNode {
    return this.#globalGainNode;
  }
}
