import { Logger } from "../logger/Logger";
import { AudioApi } from "./AudioApi";
import { AudioHelpers } from "./AudioHelpers";

export type BpxAudioPlaybackId = number;

export abstract class AudioPlayback {
  // start from 1 to avoid a case when someone checks for ID being truthy and gets `false`, because of value `0`
  protected static nextPlaybackId = 1;

  protected readonly onEnded: () => void;

  protected readonly startedAtMs: number;
  protected pausedAtMs: number | null;
  protected accumulatedPauseMs: number;

  protected isPaused: boolean;
  #isMuted: boolean;

  abstract readonly id: BpxAudioPlaybackId;
  abstract readonly type: string;

  readonly #audioContext: AudioContext;
  readonly #targetNode: AudioNode;

  #gainNode: GainNode;

  protected constructor(
    audioContext: AudioContext,
    target: AudioNode,
    muteOnStart: boolean,
    onEnded: () => void,
  ) {
    this.onEnded = onEnded;

    this.#audioContext = audioContext;

    this.#targetNode = target;

    this.#gainNode = this.#audioContext.createGain();
    this.#gainNode.gain.value = muteOnStart ? 0 : 1;
    this.#gainNode.connect(this.#targetNode);

    this.isPaused = false;
    this.#isMuted = false;

    this.startedAtMs = this.#audioContext.currentTime * 1000;
    this.pausedAtMs = null;
    this.accumulatedPauseMs = 0;
  }

  mute(fadeOutMillis: number): void {
    Logger.debugBeetPx(
      `AudioPlayback.mute (id: ${this.id}, type: ${this.type}, fadeOutMillis: ${fadeOutMillis})`,
    );

    if (this.#isMuted) return;
    this.#isMuted = true;

    if (this.isPaused) {
      return;
    }

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

    if (!this.#isMuted) return;
    this.#isMuted = false;

    if (this.isPaused) {
      return;
    }

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

    if (this.isPaused) {
      this.onEnded();
      return;
    }

    AudioHelpers.muteGain(
      this.#gainNode,
      this.#audioContext.currentTime,
      fadeOutMillis,
      () => {
        this.stopAllNodes();
        if (!this.isPaused) {
          this.onEnded();
        }
      },
    );
  }

  pause(): void {
    Logger.debugBeetPx(
      `AudioPlayback.pause (id: ${this.id}, type: ${this.type}})`,
    );

    if (this.isPaused) return;

    this.pausedAtMs = this.#audioContext.currentTime * 1000;

    AudioHelpers.muteGain(
      this.#gainNode,
      this.#audioContext.currentTime,
      AudioApi.muteUnmuteDefaultFadeMillis,
      () => {
        this.isPaused = true;
        this.stopAllNodes();
      },
    );
  }

  resume(): void {
    Logger.debugBeetPx(
      `AudioPlayback.resume (id: ${this.id}, type: ${this.type})`,
    );

    if (!this.isPaused) return;
    this.isPaused = false;

    this.#gainNode = this.#audioContext.createGain();
    this.#gainNode.gain.value = this.#isMuted ? 0 : 1;
    this.#gainNode.connect(this.#targetNode);

    this.setupAndStartNodes();

    if (this.pausedAtMs != null) {
      this.accumulatedPauseMs +=
        this.#audioContext.currentTime * 1000 - this.pausedAtMs;
      this.pausedAtMs = null;
    }

    if (!this.#isMuted) {
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
