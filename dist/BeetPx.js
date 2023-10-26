// noinspection JSUnusedGlobalSymbols
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _BeetPx_framework, _BeetPx_tryGetFramework;
import { DebugMode } from "./debug/DebugMode";
import { Logger } from "./logger/Logger";
import { testGl } from "./testGl";
export class BeetPx {
    //
    // The most important function, _has to be called first_ in order to properly initialize other fields and variables.
    //
    static init(frameworkOptions, assetsToLoad) {
        // this.#framework = new Framework(frameworkOptions);
        // return this.#framework.loadAssets(assetsToLoad);
        return Promise.resolve({
            startGame: () => {
                testGl();
            },
        });
    }
    //
    // field-like getters, the ones meant to be used
    //
    static get debug() {
        return DebugMode.enabled;
    }
    /**
     * Number of frames processed since game started.
     * It gets reset to 0 when `BeetPx.restart()` is called.
     * It counts update calls, not draw calls.
     */
    static get frameNumber() {
        return __classPrivateFieldGet(this, _a, "m", _BeetPx_tryGetFramework).call(this).frameNumber;
    }
    static get renderFps() {
        return __classPrivateFieldGet(this, _a, "m", _BeetPx_tryGetFramework).call(this).renderFps;
    }
}
_a = BeetPx, _BeetPx_tryGetFramework = function _BeetPx_tryGetFramework() {
    if (!__classPrivateFieldGet(this, _a, "f", _BeetPx_framework)) {
        throw Error(`Tried to access BeetPx API without calling BeetPx.init(…) first.`);
    }
    return __classPrivateFieldGet(this, _a, "f", _BeetPx_framework);
};
_BeetPx_framework = { value: void 0 };
//
// lifecycle methods
//
BeetPx.setOnStarted = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).setOnStarted(...args);
};
BeetPx.setOnUpdate = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).setOnUpdate(...args);
};
BeetPx.setOnDraw = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).setOnDraw(...args);
};
BeetPx.restart = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).restart(...args);
};
//
// Logger
//
BeetPx.logDebug = (...args) => {
    return Logger.debug(...args);
};
BeetPx.logInfo = (...args) => {
    return Logger.info(...args);
};
BeetPx.logWarn = (...args) => {
    return Logger.warn(...args);
};
BeetPx.logError = (...args) => {
    return Logger.error(...args);
};
//
// Game Input & Buttons
//
BeetPx.isPressed = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).gameInput.gameButtons.isPressed(...args);
};
BeetPx.setRepeating = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).gameInput.gameButtons.setRepeating(...args);
};
BeetPx.wasJustPressed = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).gameInput.gameButtons.wasJustPressed(...args);
};
BeetPx.wasJustReleased = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).gameInput.gameButtons.wasJustReleased(...args);
};
BeetPx.mostRecentInputMethods = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).gameInput.mostRecentInputMethods(...args);
};
BeetPx.connectedGamepadTypes = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).gameInput.connectedGamepadTypes(...args);
};
BeetPx.__internal__capturedEvents = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).gameInput.__internal__capturedEvents(...args);
};
//
// Draw API
//
BeetPx.setCameraOffset = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.setCameraOffset(...args);
};
BeetPx.setClippingRegion = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.setClippingRegion(...args);
};
BeetPx.removeClippingRegion = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.removeClippingRegion(...args);
};
BeetPx.setFillPattern = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.setFillPattern(...args);
};
BeetPx.mapSpriteColors = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.mapSpriteColors(...args);
};
BeetPx.setFont = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.setFont(...args);
};
BeetPx.getFont = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.getFont(...args);
};
BeetPx.clearCanvas = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.clearCanvas(...args);
};
BeetPx.pixel = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.pixel(...args);
};
BeetPx.pixels = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.pixels(...args);
};
BeetPx.line = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.line(...args);
};
BeetPx.rect = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.rect(...args);
};
BeetPx.rectFilled = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.rectFilled(...args);
};
BeetPx.ellipse = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.ellipse(...args);
};
BeetPx.ellipseFilled = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.ellipseFilled(...args);
};
// TODO: make sure the whole API gets nice JSDoc even shown in the game itself, in IDE
BeetPx.sprite = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.sprite(...args);
};
// TODO: Create a similar JSDocs API description for other API methods as well
BeetPx.print = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.print(...args);
};
BeetPx.takeCanvasSnapshot = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.takeCanvasSnapshot(...args);
};
//
// Audio API
//
BeetPx.playSoundOnce = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).audioApi.playSoundOnce(...args);
};
BeetPx.playSoundLooped = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).audioApi.playSoundLooped(...args);
};
BeetPx.playSoundSequence = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).audioApi.playSoundSequence(...args);
};
BeetPx.isAudioMuted = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).audioApi.isAudioMuted(...args);
};
BeetPx.muteAudio = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).audioApi.muteAudio(...args);
};
BeetPx.unmuteAudio = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).audioApi.unmuteAudio(...args);
};
BeetPx.mutePlayback = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).audioApi.mutePlayback(...args);
};
BeetPx.unmutePlayback = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).audioApi.unmutePlayback(...args);
};
BeetPx.pauseAudio = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).audioApi.pauseAudio(...args);
};
BeetPx.resumeAudio = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).audioApi.resumeAudio(...args);
};
BeetPx.stopAllPlaybacks = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).audioApi.stopAllPlaybacks(...args);
};
BeetPx.stopPlayback = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).audioApi.stopPlayback(...args);
};
BeetPx.__internal__audioContext = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).audioApi.__internal__audioContext(...args);
};
BeetPx.__internal__globalGainNode = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).audioApi.__internal__globalGainNode(...args);
};
//
// Storage API
//
BeetPx.savePersistedState = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).storageApi.savePersistedState(...args);
};
BeetPx.loadPersistedState = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).storageApi.loadPersistedState(...args);
};
BeetPx.clearPersistedState = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).storageApi.clearPersistedState(...args);
};
//
// Direct access to loaded assets
//
BeetPx.getImageAsset = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).assets.getImageAsset(...args);
};
BeetPx.getFontAsset = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).assets.getFontAsset(...args);
};
BeetPx.getSoundAsset = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).assets.getSoundAsset(...args);
};
BeetPx.getJsonAsset = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).assets.getJsonAsset(...args);
};
//
// other
//
BeetPx.detectedBrowserType = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).detectedBrowserType(...args);
};
export const b_ = BeetPx;
