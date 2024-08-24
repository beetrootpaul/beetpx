import { AudioPlayback } from "../audio/AudioPlayback";

export class GamePause {
  static #isEnabled: boolean = false;

  static #prevIsActive: boolean = false;
  static #isActive: boolean = false;

  static enable(): void {
    this.#isEnabled = true;
  }

  static get isActive(): boolean {
    return this.#isEnabled ? this.#isActive : false;
  }

  static get wasJustActivated(): boolean {
    return this.#isEnabled ? this.#isActive && !this.#prevIsActive : false;
  }

  static get wasJustDeactivated(): boolean {
    return this.#isEnabled ? !this.#isActive && this.#prevIsActive : false;
  }

  static earlyUpdate(): void {
    if (!this.#isEnabled) return;

    if (GamePause.wasJustActivated) {
      for (const playback of AudioPlayback.playbacksToPauseOnGamePause) {
        playback.pauseByEngine();
      }
      for (const playback of AudioPlayback.playbacksToMuteOnGamePause) {
        playback.muteByEngine();
      }
    } else if (GamePause.wasJustDeactivated) {
      for (const playback of AudioPlayback.playbacksToPauseOnGamePause) {
        playback.resumeByEngine();
      }
      for (const playback of AudioPlayback.playbacksToMuteOnGamePause) {
        playback.unmuteByEngine();
      }
    }
  }

  static lateUpdate(): void {
    if (!this.#isEnabled) return;

    this.#prevIsActive = this.#isActive;
  }

  static activate(): void {
    this.#isActive = true;
  }

  static deactivate(): void {
    this.#isActive = false;
  }
}
