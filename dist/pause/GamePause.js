import { AudioPlayback } from "../audio/AudioPlayback";
export class GamePause {
    static #isEnabled = false;
    static #prevIsActive = false;
    static #isActive = false;
    static enable() {
        this.#isEnabled = true;
    }
    static get isActive() {
        return this.#isEnabled ? this.#isActive : false;
    }
    static get wasJustActivated() {
        return this.#isEnabled ? this.#isActive && !this.#prevIsActive : false;
    }
    static get wasJustDeactivated() {
        return this.#isEnabled ? !this.#isActive && this.#prevIsActive : false;
    }
    static earlyUpdate() {
        if (!this.#isEnabled)
            return;
        if (GamePause.wasJustActivated) {
            for (const playback of AudioPlayback.playbacksToPauseOnGamePause) {
                playback.pauseByFramework();
            }
            for (const playback of AudioPlayback.playbacksToMuteOnGamePause) {
                playback.muteByFramework();
            }
        }
        else if (GamePause.wasJustDeactivated) {
            for (const playback of AudioPlayback.playbacksToPauseOnGamePause) {
                playback.resumeByFramework();
            }
            for (const playback of AudioPlayback.playbacksToMuteOnGamePause) {
                playback.unmuteByFramework();
            }
        }
    }
    static lateUpdate() {
        if (!this.#isEnabled)
            return;
        this.#prevIsActive = this.#isActive;
    }
    static activate() {
        this.#isActive = true;
    }
    static deactivate() {
        this.#isActive = false;
    }
}
//# sourceMappingURL=GamePause.js.map