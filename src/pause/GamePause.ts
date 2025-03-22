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
        playback.pauseByFramework();
      }
      for (const playback of AudioPlayback.playbacksToMuteOnGamePause) {
        playback.muteByFramework();
      }
    } else if (GamePause.wasJustDeactivated) {
      for (const playback of AudioPlayback.playbacksToPauseOnGamePause) {
        playback.resumeByFramework();
      }
      for (const playback of AudioPlayback.playbacksToMuteOnGamePause) {
        playback.unmuteByFramework();
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
