
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _BeetPx_engine, _BeetPx_tryGetEngine;
import { DebugMode } from "./debug/DebugMode";
import { Engine } from "./Engine";
import { Logger } from "./logger/Logger";

export class BeetPx {
    
    
    
    static init(engineInitParams) {
        Logger.infoBeetPx(`Initializing BeetPx ${BEETPX__VERSION} …`);
        __classPrivateFieldSet(this, _a, new Engine(engineInitParams), "f", _BeetPx_engine);
        return __classPrivateFieldGet(this, _a, "f", _BeetPx_engine).init();
    }
    
    
    
    static get debug() {
        return DebugMode.enabled;
    }
    /**
     * Number of frames processed since game started.
     * It gets reset to 0 when `BeetPx.restart()` is called.
     * It counts update calls, not draw calls.
     *
     * @return number
     */
    static get frameNumber() {
        return __classPrivateFieldGet(this, _a, "m", _BeetPx_tryGetEngine).call(this).frameNumber;
    }
    static get renderingFps() {
        return __classPrivateFieldGet(this, _a, "m", _BeetPx_tryGetEngine).call(this).renderingFps;
    }
    static get detectedBrowserType() {
        return __classPrivateFieldGet(this, _a, "m", _BeetPx_tryGetEngine).call(this).detectedBrowserType;
    }
}
_a = BeetPx, _BeetPx_tryGetEngine = function _BeetPx_tryGetEngine() {
    if (!__classPrivateFieldGet(this, _a, "f", _BeetPx_engine)) {
        throw Error(`Tried to access BeetPx API without calling BeetPx.init(…) first.`);
    }
    return __classPrivateFieldGet(this, _a, "f", _BeetPx_engine);
};
_BeetPx_engine = { value: void 0 };



BeetPx.setOnStarted = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).setOnStarted(...args);
};
BeetPx.setOnUpdate = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).setOnUpdate(...args);
};
BeetPx.setOnDraw = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).setOnDraw(...args);
};
BeetPx.restart = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).restart(...args);
};



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



BeetPx.wasAnyButtonJustPressed = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).gameInput.gameButtons.wasAnyJustPressed(...args);
};
BeetPx.wasButtonJustPressed = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).gameInput.gameButtons.wasJustPressed(...args);
};
BeetPx.wasButtonJustReleased = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).gameInput.gameButtons.wasJustReleased(...args);
};
BeetPx.isAnyButtonPressed = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).gameInput.gameButtons.isAnyPressed(...args);
};
BeetPx.isButtonPressed = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).gameInput.gameButtons.isPressed(...args);
};
BeetPx.getPressedDirection = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).gameInput.gameButtons.getPressedDirection(...args);
};
BeetPx.setButtonRepeating = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).gameInput.gameButtons.setRepeating(...args);
};
BeetPx.getRecentInputMethods = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).gameInput.getRecentInputMethods(...args);
};
BeetPx.getConnectedGamepadTypes = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).gameInput.getConnectedGamepadTypes(...args);
};
BeetPx.getEventsCapturedInLastUpdate = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).gameInput.getEventsCapturedInLastUpdate(...args);
};



BeetPx.clearCanvas = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).drawApi.clearCanvas(...args);
};
/**
 * @returns - previous clipping region in form of an array: [xy, wh]
 */
BeetPx.setClippingRegion = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).drawApi.setClippingRegion(...args);
};
/**
 * @returns - previous clipping region in form of an array: [xy, wh]
 */
BeetPx.removeClippingRegion = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).drawApi.removeClippingRegion(...args);
};
/**
 * Sets a new XY (left-top corner) of a camera's viewport
 *
 * @returns previous camera XY
 */
BeetPx.setCameraXy = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).drawApi.setCameraXy(...args);
};
/**
 * @returns previous pattern
 */
BeetPx.setDrawingPattern = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).drawApi.setDrawingPattern(...args);
};
BeetPx.drawPixel = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).drawApi.drawPixel(...args);
};
/**
 * @param {BpxVector2d} xy - sd
 * @param {BpxRgbColor} color - sd
 * @param {string[]} bits - an array representing rows from top to bottom,
 *        where each array element is a text sequence of `0` and `1` to
 *        represent drawn and skipped pixels from left to right.
 */
/**
 * Draws pixels based on a visual 2d representation in form of rows
 *   (designated by new lines) where `#` and `-` stand for a colored
 *   pixel and a lack of a pixel. Whitespaces are ignored.
 */
BeetPx.drawPixels = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).drawApi.drawPixels(...args);
};
BeetPx.drawLine = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).drawApi.drawLine(...args);
};
BeetPx.drawRect = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).drawApi.drawRect(...args);
};
BeetPx.drawRectFilled = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).drawApi.drawRectFilled(...args);
};
BeetPx.drawEllipse = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).drawApi.drawEllipse(...args);
};
BeetPx.drawEllipseFilled = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).drawApi.drawEllipseFilled(...args);
};
/**
 * @returns previous sprite color mapping
 */
BeetPx.setSpriteColorMapping = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).drawApi.setSpriteColorMapping(...args);
};
BeetPx.drawSprite = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).drawApi.drawSprite(...args);
};
BeetPx.useFont = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).drawApi.useFont(...args);
};
BeetPx.measureText = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).drawApi.measureText(...args);
};
BeetPx.drawText = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).drawApi.drawText(...args);
};
BeetPx.takeCanvasSnapshot = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).drawApi.takeCanvasSnapshot(...args);
};



BeetPx.isAudioMuted = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).audioApi.isAudioMuted(...args);
};
BeetPx.muteAudio = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).audioApi.muteAudio(...args);
};
BeetPx.unmuteAudio = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).audioApi.unmuteAudio(...args);
};
BeetPx.pauseAudio = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).audioApi.pauseAudio(...args);
};
BeetPx.resumeAudio = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).audioApi.resumeAudio(...args);
};
BeetPx.startPlayback = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).audioApi.startPlayback(...args);
};
BeetPx.startPlaybackLooped = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).audioApi.startPlaybackLooped(...args);
};
BeetPx.startPlaybackSequence = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).audioApi.startPlaybackSequence(...args);
};
BeetPx.mutePlayback = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).audioApi.mutePlayback(...args);
};
BeetPx.unmutePlayback = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).audioApi.unmutePlayback(...args);
};
BeetPx.stopPlayback = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).audioApi.stopPlayback(...args);
};
BeetPx.stopAllPlaybacks = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).audioApi.stopAllPlaybacks(...args);
};
BeetPx.getAudioContext = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).audioApi.getAudioContext(...args);
};



BeetPx.isFullScreenSupported = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).fullScreen.isFullScreenSupported(...args);
};
BeetPx.isInFullScreen = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).fullScreen.isInFullScreen(...args);
};
BeetPx.toggleFullScreen = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).fullScreen.toggleFullScreen(...args);
};



BeetPx.savePersistedState = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).storageApi.savePersistedState(...args);
};
BeetPx.loadPersistedState = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).storageApi.loadPersistedState(...args);
};
BeetPx.clearPersistedState = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).storageApi.clearPersistedState(...args);
};



BeetPx.getImageAsset = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).assets.getImageAsset(...args);
};
BeetPx.getSoundAsset = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).assets.getSoundAsset(...args);
};
BeetPx.getJsonAsset = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetEngine).call(_a).assets.getJsonAsset(...args);
};

export const b_ = BeetPx;
