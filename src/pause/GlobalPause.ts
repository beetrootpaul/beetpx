import { AudioPlayback } from "../audio/AudioPlayback";
import { BpxTimer } from "../timer/Timer";

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

    BpxTimer.timersToPauseOnGamePause =
      BpxTimer.timersToPauseOnGamePause.filter(weakRef => weakRef.deref());

    if (GlobalPause.wasJustActivated) {
      for (const weakRef of BpxTimer.timersToPauseOnGamePause) {
        weakRef.deref()!.__internal__pauseByEngine();
      }
      for (const playback of AudioPlayback.playbacksToPauseOnGamePause) {
        playback.pauseByEngine();
      }
      for (const playback of AudioPlayback.playbacksToMuteOnGamePause) {
        playback.muteByEngine();
      }
    } else if (GlobalPause.wasJustDeactivated) {
      for (const weakRef of BpxTimer.timersToPauseOnGamePause) {
        weakRef.deref()!.__internal__resumeDueToGameResume();
      }
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
