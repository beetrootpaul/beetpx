import { Assets, BpxSoundUrl } from "../assets/Assets";
import { HtmlTemplate } from "../HtmlTemplate";
import { Logger } from "../logger/Logger";
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
  static readonly #muteUnmuteDefaultFadeMillis = 100;

  readonly #assets: Assets;

  readonly #audioContext: AudioContext;
  readonly #globalGainNode: GainNode;
  readonly #pauseFadeNode: GainNode;

  readonly #playbacks: Map<BpxAudioPlaybackId, AudioPlayback> = new Map();

  #isPaused: boolean = false;
  #isMuted: boolean;

  constructor(assets: Assets, audioContext: AudioContext) {
    this.#assets = assets;
    this.#audioContext = audioContext;

    this.#isMuted = this.#loadStoredGlobalMuteUnmuteState();
    HtmlTemplate.updateMutedClass(this.#isMuted);

    this.#globalGainNode = this.#audioContext.createGain();
    this.#globalGainNode.gain.value = this.#isMuted ? 0 : 1;
    this.#globalGainNode.connect(this.#audioContext.destination);

    this.#pauseFadeNode = this.#audioContext.createGain();
    this.#pauseFadeNode.gain.value = 1;
    this.#pauseFadeNode.connect(this.#globalGainNode);
  }

  restart(): void {
    this.stopAllPlaybacks();
    this.#playbacks.clear();

    // in case audio was paused
    this.#isPaused = false;
    AudioHelpers.unmuteGain(
      this.#pauseFadeNode,
      this.#audioContext.currentTime,
      0,
    );
    this.#audioContext.resume().catch(err => {
      Logger.errorBeetPx(err);
    });
  }

  // In some browsers audio should start in result of user interaction (e.g. button click).
  // Since we cannot assure it for every game setup, let' expose a function which tries to
  // resume the AudioContext and call it on every user interaction detected by this engine.
  async tryToResumeAudioContextSuspendedByBrowserForSecurityReasons(): Promise<boolean> {
    Logger.debugBeetPx(
      "AudioApi.tryToResumeAudioContextSuspendedByBrowserForSecurityReasons",
    );

    if (this.#audioContext.state === "running") {
      Logger.debugBeetPx("Audio Context is already running");
      return Promise.resolve(true);
    }

    if (this.#isPaused) {
      Logger.debugBeetPx(
        "Cannot detect if Audio Context requires resuming, because it is intentionally paused (suspended) right now",
      );
      return Promise.resolve(false);
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
    },
  ): BpxAudioPlaybackId {
    opts ??= {};
    opts.muteOnStart ??= false;

    Logger.debugBeetPx(
      `AudioApi.startPlayback (muteOnStart: ${opts.muteOnStart})`,
    );

    const playback = new AudioPlaybackOnce(soundUrl, {
      assets: this.#assets,
      audioContext: this.#audioContext,
      target: this.#pauseFadeNode,
      muteOnStart: opts.muteOnStart,
      onEnded: () => {
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
    },
  ): BpxAudioPlaybackId {
    opts ??= {};
    opts.muteOnStart ??= false;

    Logger.debugBeetPx(
      `AudioApi.startPlaybackLooped (muteOnStart: ${opts.muteOnStart})`,
    );

    const playback = new AudioPlaybackLooped(soundUrl, {
      assets: this.#assets,
      audioContext: this.#audioContext,
      target: this.#pauseFadeNode,
      muteOnStart: opts.muteOnStart,
      onEnded: () => {
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
    },
  ): BpxAudioPlaybackId {
    opts ??= {};
    opts.muteOnStart ??= false;

    Logger.debugBeetPx(
      `AudioApi.startPlaybackSequence (muteOnStart: ${opts.muteOnStart})`,
    );

    const playback = new AudioPlaybackSequence(soundSequence, {
      assets: this.#assets,
      audioContext: this.#audioContext,
      target: this.#pauseFadeNode,
      muteOnStart: opts.muteOnStart,
      onEnded: () => {
        this.#playbacks.delete(playback.id);
      },
    });
    this.#playbacks.set(playback.id, playback);

    return playback.id;
  }

  isAudioMuted(): boolean {
    return this.#isMuted;
  }

  muteAudio(opts: { fadeOutMillis?: number } = {}): void {
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
      this.#isPaused ? 0 : (
        opts.fadeOutMillis ?? AudioApi.#muteUnmuteDefaultFadeMillis
      ),
    );
  }

  unmuteAudio(opts: { fadeInMillis?: number } = {}): void {
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
      this.#isPaused ? 0 : (
        opts.fadeInMillis ?? AudioApi.#muteUnmuteDefaultFadeMillis
      ),
    );
  }

  // TODO: how symmetrical is it to the global-level API?
  mutePlayback(
    playbackId: BpxAudioPlaybackId,
    opts: { fadeOutMillis?: number } = {},
  ): void {
    Logger.debugBeetPx(
      `AudioApi.mutePlayback (fadeOutMillis: ${opts.fadeOutMillis})`,
    );

    this.#playbacks
      .get(playbackId)
      ?.mute(
        this.#isPaused ? 0 : (
          opts.fadeOutMillis ?? AudioApi.#muteUnmuteDefaultFadeMillis
        ),
      );
  }

  unmutePlayback(
    playbackId: BpxAudioPlaybackId,
    opts: { fadeInMillis?: number } = {},
  ): void {
    Logger.debugBeetPx(
      `AudioApi.unmutePlayback (fadeInMillis: ${opts.fadeInMillis})`,
    );

    this.#playbacks
      .get(playbackId)
      ?.unmute(
        this.#isPaused ? 0 : (
          opts.fadeInMillis ?? AudioApi.#muteUnmuteDefaultFadeMillis
        ),
      );
  }

  // TODO: how symmetrical is it to the playback-level API?
  pauseAudio(): void {
    Logger.debugBeetPx("AudioApi.pauseAudio");

    if (this.#isPaused) return;
    this.#isPaused = true;

    AudioHelpers.muteGain(
      this.#pauseFadeNode,
      this.#audioContext.currentTime,
      AudioApi.#muteUnmuteDefaultFadeMillis,
      () => {
        this.#audioContext.suspend().catch(err => {
          Logger.errorBeetPx(err);
        });
      },
    );
  }

  resumeAudio(): void {
    Logger.debugBeetPx("AudioApi.resumeAudio");

    if (!this.#isPaused) return;
    this.#isPaused = false;

    this.#audioContext
      .resume()
      .then(() => {
        AudioHelpers.unmuteGain(
          this.#pauseFadeNode,
          this.#audioContext.currentTime,
          AudioApi.#muteUnmuteDefaultFadeMillis,
        );
      })
      .catch(err => {
        Logger.errorBeetPx(err);
      });
  }

  stopAllPlaybacks(opts: { fadeOutMillis?: number } = {}): void {
    Logger.debugBeetPx(
      `AudioApi.stopAllPlaybacks (fadeOutMillis: ${opts.fadeOutMillis})`,
    );

    for (const playback of this.#playbacks.values()) {
      playback.stop(
        this.#isPaused || this.#isMuted ?
          0
        : opts.fadeOutMillis ?? AudioApi.#muteUnmuteDefaultFadeMillis,
      );
    }
  }

  stopPlayback(
    playbackId: BpxAudioPlaybackId,
    opts: { fadeOutMillis?: number } = {},
  ): void {
    Logger.debugBeetPx(
      `AudioApi.stopPlayback (fadeOutMillis: ${opts.fadeOutMillis})`,
    );

    this.#playbacks
      .get(playbackId)
      ?.stop(
        this.#isPaused || this.#isMuted ?
          0
        : opts.fadeOutMillis ?? AudioApi.#muteUnmuteDefaultFadeMillis,
      );
  }

  #loadStoredGlobalMuteUnmuteState(): boolean {
    return (
      window.localStorage.getItem(AudioApi.#storageMuteUnmuteKey) ===
      AudioApi.#storageMuteUnmuteTrue
    );
  }

  #storeGlobalMuteUnmuteState(muted: boolean): void {
    if (muted) {
      window.localStorage.setItem(
        AudioApi.#storageMuteUnmuteKey,
        AudioApi.#storageMuteUnmuteTrue,
      );
    } else {
      window.localStorage.removeItem(AudioApi.#storageMuteUnmuteKey);
    }
  }

  getAudioContext(): AudioContext {
    return this.#audioContext;
  }

  getGlobalGainNode(): GainNode {
    return this.#globalGainNode;
  }
}
