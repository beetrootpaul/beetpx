import { AudioPlayback } from "../audio/AudioPlayback";
export class GlobalPause {
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
    static update() {
        if (!this.#isEnabled)
            return;
        if (GlobalPause.wasJustActivated) {
            for (const playback of AudioPlayback.playbacksToPauseOnGamePause) {
                playback.pauseByEngine();
            }
            for (const playback of AudioPlayback.playbacksToMuteOnGamePause) {
                playback.muteByEngine();
            }
        }
        else if (GlobalPause.wasJustDeactivated) {
            for (const playback of AudioPlayback.playbacksToPauseOnGamePause) {
                playback.resumeByEngine();
            }
            for (const playback of AudioPlayback.playbacksToMuteOnGamePause) {
                playback.unmuteByEngine();
            }
        }
        this.#prevIsActive = this.#isActive;
    }
    static activate() {
        this.#isActive = true;
    }
    static deactivate() {
        this.#isActive = false;
    }
}
