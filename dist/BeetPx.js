import { Framework } from "./Framework";
import { DebugMode } from "./debug/DebugMode";
import { Logger } from "./logger/Logger";
import { GamePause } from "./pause/GamePause";
export class BeetPx {
    constructor() { }
    static #dataStoredBeforeBeetPxStarted = {};
    static #tryGetFramework() {
        if (!Framework.frameworkSingleton) {
            throw Error(`Tried to access BeetPx API without calling BeetPx.start(…) first.`);
        }
        return Framework.frameworkSingleton;
    }
    static async start(config) {
        if (Framework.frameworkSingleton) {
            throw Error("BeetPx is already started");
        }
        Logger.infoBeetPx(`BeetPx ${window.BEETPX__VERSION} : Initializing…`);
        Framework.frameworkSingleton = new Framework(config);
        const { startGame } = await Framework.frameworkSingleton.init();
        Logger.infoBeetPx(`BeetPx ${window.BEETPX__VERSION} : Initialized`);
        if (this.#dataStoredBeforeBeetPxStarted.onStarted) {
            Framework.frameworkSingleton.setOnStarted(this.#dataStoredBeforeBeetPxStarted.onStarted);
        }
        if (this.#dataStoredBeforeBeetPxStarted.onUpdate) {
            Framework.frameworkSingleton.setOnUpdate(this.#dataStoredBeforeBeetPxStarted.onUpdate);
        }
        if (this.#dataStoredBeforeBeetPxStarted.onDraw) {
            Framework.frameworkSingleton.setOnDraw(this.#dataStoredBeforeBeetPxStarted.onDraw);
        }
        this.#dataStoredBeforeBeetPxStarted = {};
        return await startGame();
    }
    static get debug() {
        return DebugMode.enabled;
    }
    static get canvasSize() {
        return this.#tryGetFramework().canvasSize;
    }
    static get frameNumber() {
        return this.#tryGetFramework().frameNumber;
    }
    static get frameNumberOutsidePause() {
        return this.#tryGetFramework().frameNumberOutsidePause;
    }
    static get renderingFps() {
        return this.#tryGetFramework().renderingFps;
    }
    static get detectedBrowserType() {
        return this.#tryGetFramework().detectedBrowserType;
    }
    static setOnStarted(onStarted) {
        if (Framework.frameworkSingleton) {
            Framework.frameworkSingleton.setOnStarted(onStarted);
        }
        else {
            this.#dataStoredBeforeBeetPxStarted.onStarted = onStarted;
        }
    }
    static setOnUpdate(onUpdate) {
        if (Framework.frameworkSingleton) {
            Framework.frameworkSingleton.setOnUpdate(onUpdate);
        }
        else {
            this.#dataStoredBeforeBeetPxStarted.onUpdate = onUpdate;
        }
    }
    static setOnDraw(onDraw) {
        if (Framework.frameworkSingleton) {
            Framework.frameworkSingleton.setOnDraw(onDraw);
        }
        else {
            this.#dataStoredBeforeBeetPxStarted.onDraw = onDraw;
        }
    }
    static restart() {
        this.#tryGetFramework().restart();
    }
    static logDebug(...args) {
        Logger.debug(...args);
    }
    static logInfo(...args) {
        Logger.info(...args);
    }
    static logWarn(...args) {
        Logger.warn(...args);
    }
    static logError(...args) {
        Logger.error(...args);
    }
    static get isPaused() {
        return GamePause.isActive;
    }
    static get wasJustPaused() {
        return GamePause.wasJustActivated;
    }
    static get wasJustResumed() {
        return GamePause.wasJustDeactivated;
    }
    static pause() {
        GamePause.activate();
    }
    static resume() {
        GamePause.deactivate();
    }
    static wasAnyButtonJustPressed() {
        return this.#tryGetFramework().gameInput.gameButtons.wasAnyJustPressed();
    }
    static wasButtonJustPressed(button) {
        return this.#tryGetFramework().gameInput.gameButtons.wasJustPressed(button);
    }
    static wasButtonJustReleased(button) {
        return this.#tryGetFramework().gameInput.gameButtons.wasJustReleased(button);
    }
    static isAnyButtonPressed() {
        return this.#tryGetFramework().gameInput.gameButtons.isAnyPressed();
    }
    static isButtonPressed(button) {
        return this.#tryGetFramework().gameInput.gameButtons.isPressed(button);
    }
    static getPressedDirection() {
        return this.#tryGetFramework().gameInput.gameButtons.getPressedDirection();
    }
    static setButtonRepeating(button, repeating) {
        this.#tryGetFramework().gameInput.gameButtons.setButtonRepeating(button, repeating);
    }
    static getRecentInputMethods() {
        return this.#tryGetFramework().gameInput.getRecentInputMethods();
    }
    static isTouchInputMethodAvailable() {
        return this.#tryGetFramework().gameInput.isTouchAvailable;
    }
    static getConnectedGamepadTypes() {
        return this.#tryGetFramework().gameInput.getConnectedGamepadTypes();
    }
    static getEventsCapturedInLastUpdate() {
        return this.#tryGetFramework().gameInput.getEventsCapturedInLastUpdate();
    }
    static isAudioMuted() {
        return this.#tryGetFramework().audioApi.isAudioMuted();
    }
    static muteAudio(opts) {
        this.#tryGetFramework().audioApi.muteAudio(opts);
    }
    static unmuteAudio(opts) {
        this.#tryGetFramework().audioApi.unmuteAudio(opts);
    }
    static startPlayback(soundUrl, opts) {
        return this.#tryGetFramework().audioApi.startPlayback(soundUrl, opts);
    }
    static startPlaybackLooped(soundUrl, opts) {
        return this.#tryGetFramework().audioApi.startPlaybackLooped(soundUrl, opts);
    }
    static startPlaybackSequence(soundSequence, opts) {
        return this.#tryGetFramework().audioApi.startPlaybackSequence(soundSequence, opts);
    }
    static mutePlayback(playbackId, opts) {
        this.#tryGetFramework().audioApi.mutePlayback(playbackId, opts);
    }
    static unmutePlayback(playbackId, opts) {
        this.#tryGetFramework().audioApi.unmutePlayback(playbackId, opts);
    }
    static stopPlayback(playbackId, opts) {
        this.#tryGetFramework().audioApi.stopPlayback(playbackId, opts);
    }
    static pausePlayback(playbackId) {
        this.#tryGetFramework().audioApi.pausePlayback(playbackId);
    }
    static resumePlayback(playbackId) {
        this.#tryGetFramework().audioApi.resumePlayback(playbackId);
    }
    static getAudioContext() {
        return this.#tryGetFramework().audioApi.getAudioContext();
    }
    static isFullScreenSupported() {
        return this.#tryGetFramework().fullScreen.isFullScreenSupported();
    }
    static isInFullScreen() {
        return this.#tryGetFramework().fullScreen.isInFullScreen();
    }
    static toggleFullScreen() {
        this.#tryGetFramework().fullScreen.toggleFullScreen();
    }
    static savePersistedState(value) {
        this.#tryGetFramework().storageApi.savePersistedState(value);
    }
    static loadPersistedState() {
        return this.#tryGetFramework().storageApi.loadPersistedState();
    }
    static clearPersistedState() {
        this.#tryGetFramework().storageApi.clearPersistedState();
    }
    static getImageAsset(imageUrl) {
        return this.#tryGetFramework().assets.getImageAsset(imageUrl);
    }
    static getSoundAsset(soundUrl) {
        return this.#tryGetFramework().assets.getSoundAsset(soundUrl);
    }
    static getJsonAsset(jsonUrl) {
        return this.#tryGetFramework().assets.getJsonAsset(jsonUrl);
    }
}
export const $x = BeetPx;
//# sourceMappingURL=BeetPx.js.map