import { AudioPlayback } from "../audio/AudioPlayback";

export class GlobalPause {
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

  static update(): void {
    if (!this.#isEnabled) return;

    if (GlobalPause.wasJustActivated) {
      for (const playback of AudioPlayback.playbacksToPauseOnGamePause) {
        playback.pauseByEngine();
      }
      for (const playback of AudioPlayback.playbacksToMuteOnGamePause) {
        playback.muteByEngine();
      }
    } else if (GlobalPause.wasJustDeactivated) {
      for (const playback of AudioPlayback.playbacksToPauseOnGamePause) {
        playback.resumeByEngine();
      }
      for (const playback of AudioPlayback.playbacksToMuteOnGamePause) {
        playback.unmuteByEngine();
      }
    }

    this.#prevIsActive = this.#isActive;
  }

  static activate(): void {
    this.#isActive = true;
  }

  static deactivate(): void {
    this.#isActive = false;
  }
}
