import { Logger } from "../logger/Logger";
import { AudioApi } from "./AudioApi";
import { AudioHelpers } from "./AudioHelpers";

/**
 * An identifier of a played audio. Can be used to e.g. mute a specific sound.
 *
 * @see {@link BeetPx.startPlayback}
 * @see {@link BeetPx.startPlaybackLooped}
 * @see {@link BeetPx.startPlaybackSequence}
 *
 * @category Audio
 */
export type BpxAudioPlaybackId = number;

export abstract class AudioPlayback {
  static playbacksToPauseOnGamePause: Set<AudioPlayback> = new Set();
  static playbacksToMuteOnGamePause: Set<AudioPlayback> = new Set();

  // start from 1 to avoid a case when someone checks for ID being truthy and gets `false`, because of value `0`
  protected static nextPlaybackId = 1;

  protected readonly onEnded: () => void;

  protected readonly startedAtMs: number;
  protected pausedAtMs: number | null;
  protected accumulatedPauseMs: number;

  protected isPausedByFramework: boolean;
  protected isPausedByGame: boolean;
  #isMutedByFramework: boolean;
  #isMutedByGame: boolean;

  abstract readonly id: BpxAudioPlaybackId;
  abstract readonly type: string;

  readonly #audioContext: AudioContext;
  readonly #targetNode: AudioNode;

  #gainNode: GainNode;

  protected constructor(
    audioContext: AudioContext,
    target: AudioNode,
    muteOnStart: boolean,
    onGamePause: "pause" | "mute" | "ignore",
    onEnded: () => void,
  ) {
    if (onGamePause === "pause") {
      AudioPlayback.playbacksToPauseOnGamePause.add(this);
    } else if (onGamePause === "mute") {
      AudioPlayback.playbacksToMuteOnGamePause.add(this);
    }

    this.onEnded = () => {
      onEnded();
      AudioPlayback.playbacksToPauseOnGamePause.delete(this);
      AudioPlayback.playbacksToMuteOnGamePause.delete(this);
    };

    this.#audioContext = audioContext;

    this.#targetNode = target;

    this.#gainNode = this.#audioContext.createGain();
    this.#gainNode.gain.value = muteOnStart ? 0 : 1;
    this.#gainNode.connect(this.#targetNode);

    this.isPausedByGame = false;
    this.isPausedByFramework = false;
    this.#isMutedByGame = muteOnStart;
    this.#isMutedByFramework = false;

    this.startedAtMs = this.#audioContext.currentTime * 1000;
    this.pausedAtMs = null;
    this.accumulatedPauseMs = 0;
  }

  mute(fadeOutMillis: number): void {
    Logger.debugBeetPx(
      `AudioPlayback.mute (id: ${this.id}, type: ${this.type}, fadeOutMillis: ${fadeOutMillis})`,
    );

    if (this.#isMutedByGame) return;
    this.#isMutedByGame = true;

    if (this.#isMutedByFramework) return;

    if (this.isPausedByGame || this.isPausedByFramework) {
      return;
    }

    this.#muteImpl(fadeOutMillis);
  }

  muteByFramework(): void {
    Logger.debugBeetPx(
      `AudioPlayback.muteByFramework (id: ${this.id}, type: ${this.type})`,
    );

    if (this.#isMutedByFramework) return;
    this.#isMutedByFramework = true;

    if (this.#isMutedByGame) return;

    if (this.isPausedByGame || this.isPausedByFramework) {
      return;
    }

    this.#muteImpl(AudioApi.muteUnmuteDefaultFadeMillis);
  }

  #muteImpl(fadeOutMillis: number): void {
    AudioHelpers.muteGain(
      this.#gainNode,
      this.#audioContext.currentTime,
      fadeOutMillis,
    );
  }

  unmute(fadeInMillis: number): void {
    Logger.debugBeetPx(
      `AudioPlayback.unmute (id: ${this.id}, type: ${this.type}, fadeInMillis: ${fadeInMillis})`,
    );

    if (!this.#isMutedByGame) return;
    this.#isMutedByGame = false;

    if (this.#isMutedByFramework) return;

    if (this.isPausedByGame || this.isPausedByFramework) {
      return;
    }

    this.#unmuteImpl(fadeInMillis);
  }

  unmuteByFramework(): void {
    Logger.debugBeetPx(
      `AudioPlayback.unmuteByFramework (id: ${this.id}, type: ${this.type})`,
    );

    if (!this.#isMutedByFramework) return;
    this.#isMutedByFramework = false;

    if (this.#isMutedByGame) return;

    if (this.isPausedByGame || this.isPausedByFramework) {
      return;
    }

    this.#unmuteImpl(AudioApi.muteUnmuteDefaultFadeMillis);
  }

  #unmuteImpl(fadeInMillis: number): void {
    AudioHelpers.unmuteGain(
      this.#gainNode,
      this.#audioContext.currentTime,
      fadeInMillis,
    );
  }

  stop(fadeOutMillis: number): void {
    Logger.debugBeetPx(
      `AudioPlayback.stop (id: ${this.id}, type: ${this.type}, fadeOutMillis: ${fadeOutMillis})`,
    );

    if (this.isPausedByGame || this.isPausedByFramework) {
      this.onEnded();
      return;
    }

    AudioHelpers.muteGain(
      this.#gainNode,
      this.#audioContext.currentTime,
      fadeOutMillis,
      () => {
        this.stopAllNodes();
        if (!this.isPausedByGame && !this.isPausedByFramework) {
          this.onEnded();
        }
      },
    );
  }

  pause(): void {
    Logger.debugBeetPx(
      `AudioPlayback.pause (id: ${this.id}, type: ${this.type}})`,
    );

    if (this.isPausedByGame) return;
    this.isPausedByGame = true;

    if (this.isPausedByFramework) return;

    this.#pauseImpl();
  }

  pauseByFramework(): void {
    Logger.debugBeetPx(
      `AudioPlayback.pauseByFramework (id: ${this.id}, type: ${this.type}})`,
    );

    if (this.isPausedByFramework) return;
    this.isPausedByFramework = true;

    if (this.isPausedByGame) return;

    this.#pauseImpl();
  }

  #pauseImpl(): void {
    this.pausedAtMs = this.#audioContext.currentTime * 1000;

    AudioHelpers.muteGain(
      this.#gainNode,
      this.#audioContext.currentTime,
      AudioApi.muteUnmuteDefaultFadeMillis,
      () => {
        this.stopAllNodes();
      },
    );
  }

  resume(): void {
    Logger.debugBeetPx(
      `AudioPlayback.resume (id: ${this.id}, type: ${this.type})`,
    );

    if (!this.isPausedByGame) return;
    this.isPausedByGame = false;

    if (this.isPausedByFramework) return;

    this.#resumeImpl();
  }

  resumeByFramework(): void {
    Logger.debugBeetPx(
      `AudioPlayback.resumeByFramework (id: ${this.id}, type: ${this.type})`,
    );

    if (!this.isPausedByFramework) return;
    this.isPausedByFramework = false;

    if (this.isPausedByGame) return;

    this.#resumeImpl();
  }

  #resumeImpl(): void {
    this.#gainNode = this.#audioContext.createGain();
    this.#gainNode.gain.value =
      this.#isMutedByGame || this.isPausedByFramework ? 0 : 1;
    this.#gainNode.connect(this.#targetNode);

    this.setupAndStartNodes();

    if (this.pausedAtMs != null) {
      this.accumulatedPauseMs +=
        this.#audioContext.currentTime * 1000 - this.pausedAtMs;
      this.pausedAtMs = null;
    }

    if (!this.#isMutedByGame && !this.isPausedByFramework) {
      AudioHelpers.unmuteGain(
        this.#gainNode,
        this.#audioContext.currentTime,
        AudioApi.muteUnmuteDefaultFadeMillis,
        () => {},
      );
    }
  }

  protected createSourceNode(): AudioBufferSourceNode {
    return this.#audioContext.createBufferSource();
  }

  protected connectToMainGainNode(audioNode: AudioNode): void {
    audioNode.connect(this.#gainNode);
  }

  protected disconnectFromOutput(): void {
    this.#gainNode.disconnect();
  }

  protected abstract stopAllNodes(): void;

  protected abstract setupAndStartNodes(): void;
}
