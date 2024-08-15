import { Engine } from "./Engine";
import { DebugMode } from "./debug/DebugMode";
import { Logger } from "./logger/Logger";
import { GamePause } from "./pause/GamePause";
export class BeetPx {
    constructor() { }
    static #dataStoredBeforeEngineStarted = {};
    static #tryGetEngine() {
        if (!Engine.engineSingleton) {
            throw Error(`Tried to access BeetPx API without calling BeetPx.start(…) first.`);
        }
        return Engine.engineSingleton;
    }
    static async start(config) {
        if (Engine.engineSingleton) {
            throw Error("BeetPx is already started");
        }
        Logger.infoBeetPx(`BeetPx ${window.BEETPX__VERSION} : Initializing…`);
        Engine.engineSingleton = new Engine(config);
        const { startGame } = await Engine.engineSingleton.init();
        Logger.infoBeetPx(`BeetPx ${window.BEETPX__VERSION} : Initialized`);
        if (this.#dataStoredBeforeEngineStarted.onStarted) {
            Engine.engineSingleton.setOnStarted(this.#dataStoredBeforeEngineStarted.onStarted);
        }
        if (this.#dataStoredBeforeEngineStarted.onUpdate) {
            Engine.engineSingleton.setOnUpdate(this.#dataStoredBeforeEngineStarted.onUpdate);
        }
        if (this.#dataStoredBeforeEngineStarted.onDraw) {
            Engine.engineSingleton.setOnDraw(this.#dataStoredBeforeEngineStarted.onDraw);
        }
        this.#dataStoredBeforeEngineStarted = {};
        return await startGame();
    }
    static get debug() {
        return DebugMode.enabled;
    }
    static get canvasSize() {
        return this.#tryGetEngine().canvasSize;
    }
    static get frameNumber() {
        return this.#tryGetEngine().frameNumber;
    }
    static get frameNumberOutsidePause() {
        return this.#tryGetEngine().frameNumberOutsidePause;
    }
    static get renderingFps() {
        return this.#tryGetEngine().renderingFps;
    }
    static get detectedBrowserType() {
        return this.#tryGetEngine().detectedBrowserType;
    }
    static setOnStarted(onStarted) {
        if (Engine.engineSingleton) {
            Engine.engineSingleton.setOnStarted(onStarted);
        }
        else {
            this.#dataStoredBeforeEngineStarted.onStarted = onStarted;
        }
    }
    static setOnUpdate(onUpdate) {
        if (Engine.engineSingleton) {
            Engine.engineSingleton.setOnUpdate(onUpdate);
        }
        else {
            this.#dataStoredBeforeEngineStarted.onUpdate = onUpdate;
        }
    }
    static setOnDraw(onDraw) {
        if (Engine.engineSingleton) {
            Engine.engineSingleton.setOnDraw(onDraw);
        }
        else {
            this.#dataStoredBeforeEngineStarted.onDraw = onDraw;
        }
    }
    static restart() {
        this.#tryGetEngine().restart();
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
        return this.#tryGetEngine().gameInput.gameButtons.wasAnyJustPressed();
    }
    static wasButtonJustPressed(button) {
        return this.#tryGetEngine().gameInput.gameButtons.wasJustPressed(button);
    }
    static wasButtonJustReleased(button) {
        return this.#tryGetEngine().gameInput.gameButtons.wasJustReleased(button);
    }
    static isAnyButtonPressed() {
        return this.#tryGetEngine().gameInput.gameButtons.isAnyPressed();
    }
    static isButtonPressed(button) {
        return this.#tryGetEngine().gameInput.gameButtons.isPressed(button);
    }
    static getPressedDirection() {
        return this.#tryGetEngine().gameInput.gameButtons.getPressedDirection();
    }
    static setButtonRepeating(button, repeating) {
        this.#tryGetEngine().gameInput.gameButtons.setButtonRepeating(button, repeating);
    }
    static getRecentInputMethods() {
        return this.#tryGetEngine().gameInput.getRecentInputMethods();
    }
    static isTouchInputMethodAvailable() {
        return this.#tryGetEngine().gameInput.isTouchAvailable;
    }
    static getConnectedGamepadTypes() {
        return this.#tryGetEngine().gameInput.getConnectedGamepadTypes();
    }
    static getEventsCapturedInLastUpdate() {
        return this.#tryGetEngine().gameInput.getEventsCapturedInLastUpdate();
    }
    static isAudioMuted() {
        return this.#tryGetEngine().audioApi.isAudioMuted();
    }
    static muteAudio(opts) {
        this.#tryGetEngine().audioApi.muteAudio(opts);
    }
    static unmuteAudio(opts) {
        this.#tryGetEngine().audioApi.unmuteAudio(opts);
    }
    static startPlayback(soundUrl, opts) {
        return this.#tryGetEngine().audioApi.startPlayback(soundUrl, opts);
    }
    static startPlaybackLooped(soundUrl, opts) {
        return this.#tryGetEngine().audioApi.startPlaybackLooped(soundUrl, opts);
    }
    static startPlaybackSequence(soundSequence, opts) {
        return this.#tryGetEngine().audioApi.startPlaybackSequence(soundSequence, opts);
    }
    static mutePlayback(playbackId, opts) {
        this.#tryGetEngine().audioApi.mutePlayback(playbackId, opts);
    }
    static unmutePlayback(playbackId, opts) {
        this.#tryGetEngine().audioApi.unmutePlayback(playbackId, opts);
    }
    static stopPlayback(playbackId, opts) {
        this.#tryGetEngine().audioApi.stopPlayback(playbackId, opts);
    }
    static pausePlayback(playbackId) {
        this.#tryGetEngine().audioApi.pausePlayback(playbackId);
    }
    static resumePlayback(playbackId) {
        this.#tryGetEngine().audioApi.resumePlayback(playbackId);
    }
    static getAudioContext() {
        return this.#tryGetEngine().audioApi.getAudioContext();
    }
    static isFullScreenSupported() {
        return this.#tryGetEngine().fullScreen.isFullScreenSupported();
    }
    static isInFullScreen() {
        return this.#tryGetEngine().fullScreen.isInFullScreen();
    }
    static toggleFullScreen() {
        this.#tryGetEngine().fullScreen.toggleFullScreen();
    }
    static savePersistedState(value) {
        this.#tryGetEngine().storageApi.savePersistedState(value);
    }
    static loadPersistedState() {
        return this.#tryGetEngine().storageApi.loadPersistedState();
    }
    static clearPersistedState() {
        this.#tryGetEngine().storageApi.clearPersistedState();
    }
    static getImageAsset(imageUrl) {
        return this.#tryGetEngine().assets.getImageAsset(imageUrl);
    }
    static getSoundAsset(soundUrl) {
        return this.#tryGetEngine().assets.getSoundAsset(soundUrl);
    }
    static getJsonAsset(jsonUrl) {
        return this.#tryGetEngine().assets.getJsonAsset(jsonUrl);
    }
}
export const $x = BeetPx;
//# sourceMappingURL=BeetPx.js.map