
import { Engine } from "./Engine";
import { DebugMode } from "./debug/DebugMode";
import { Logger } from "./logger/Logger";
import { GlobalPause } from "./pause/GlobalPause";
import { assertUnreachable } from "./utils/assertUnreachable";
import { booleanChangingEveryNthFrame } from "./utils/booleanChangingEveryNthFrame";
import { clamp } from "./utils/clamp";
import { drawTextWithOutline } from "./utils/drawTextWithOutline";
import { identity } from "./utils/identity";
import { lerp } from "./utils/lerp";
import { mod } from "./utils/mod";
import { offset4Directions } from "./utils/offset4Directions";
import { offset8Directions } from "./utils/offset8Directions";
import { randomElementOf } from "./utils/randomElementOf";
import { range } from "./utils/range";
import { repeatEachElement } from "./utils/repeatEachElement";
import { throwError } from "./utils/throwError";
import { trigAtan2 } from "./utils/trigAtan2";
import { trigCos } from "./utils/trigCos";
import { trigSin } from "./utils/trigSin";

export class BeetPxUtils {
    
    constructor() { }
    /**
     * This function is meant to be used in a last branch of `if - else if - … - else`
     *   chain or in `default` of `switch - case - case - …`. Let's imagine there is
     *   a union type of which we check all possible cases. Someday we add one more
     *   type to the union, but we forget to extend our `switch` by that one more `case`.
     *   Thanks to `assertUnreachable(theValueOfThatUnionType)` the TypeScript checker
     *   will inform us about such mistake.
     *
     * @param thingThatShouldBeOfTypeNeverAtThisPoint - a value which we expect to be of type never
     */
    static assertUnreachable(thingThatShouldBeOfTypeNeverAtThisPoint) {
        assertUnreachable(thingThatShouldBeOfTypeNeverAtThisPoint);
    }
    static booleanChangingEveryNthFrame(n, opts) {
        return booleanChangingEveryNthFrame(n, opts);
    }
    /**
     * Returns the middle number. Example usage: `clamp(min, value, max)`
     *   in order to find a value which is:
     *   - `value` if it is `>= min` and `<= max`
     *   - `min` if `value` is `< min`
     *   - `max` if `value` is `> max`
     */
    static clamp(a, b, c) {
        return clamp(a, b, c);
    }
    static drawTextWithOutline(text, canvasXy1, textColor, outlineColor, opts) {
        drawTextWithOutline(text, canvasXy1, textColor, outlineColor, opts);
    }
    static identity(param) {
        return identity(param);
    }
    static lerp(a, b, t, opts) {
        return lerp(a, b, t, opts);
    }
    /**
     * a modulo operation – in contrary to native `%`, this returns results from [0, n) range (positive values only)
     */
    static mod(value, modulus) {
        return mod(value, modulus);
    }
    static noop() { }
    /**
     * Generates a list of XY to add to a given coordinate in order to get all offsets by 1 pixel in 4 directions.
     */
    static offset4Directions() {
        return offset4Directions();
    }
    /**
     * Generates a list of XY to add to a given coordinate in order to get all offsets by 1 pixel in 8 directions.
     */
    static offset8Directions() {
        return offset8Directions();
    }
    static randomElementOf(array) {
        return randomElementOf(array);
    }
    static range(n) {
        return range(n);
    }
    static repeatEachElement(times, array) {
        return repeatEachElement(times, array);
    }
    /**
     * To be used as a value, e.g. in `definedValue: maybeUndefined() ?? throwError("…")`.
     */
    static throwError(message) {
        throwError(message);
    }
    /**
     * @return turn angle. A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    static trigAtan2(x, y) {
        return trigAtan2(x, y);
    }
    /**
     * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    static trigCos(turnAngle) {
        return trigCos(turnAngle);
    }
    /**
     * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    static trigSin(turnAngle) {
        return trigSin(turnAngle);
    }
}

export class BeetPxDraw {
    
    constructor() { }
    static #tryGetEngine(calledFnName) {
        if (!Engine.engineSingleton) {
            throw Error(`Tried to access BeetPx API without calling BeetPx.start(…) first.`);
        }
        if (!Engine.engineSingleton.isInsideDrawOrStartedCallback) {
            Logger.warnBeetPx(`Used "${calledFnName}" outside of either "setOnDraw" or "setOnStarted" callback.`);
        }
        return Engine.engineSingleton;
    }
    static clearCanvas(color) {
        BeetPxDraw.#tryGetEngine("clearCanvas").drawApi.clearCanvas(color);
    }
    /**
     * @returns - previous clipping region in form of an array: [xy, wh]
     */
    static setClippingRegion(xy, wh) {
        return BeetPxDraw.#tryGetEngine("setClippingRegion").drawApi.setClippingRegion(xy, wh);
    }
    /**
     * @returns - previous clipping region in form of an array: [xy, wh]
     */
    static removeClippingRegion() {
        return BeetPxDraw.#tryGetEngine("removeClippingRegion").drawApi.removeClippingRegion();
    }
    /**
     * Sets a new XY (left-top corner) of a camera's viewport
     *
     * @returns previous camera XY
     */
    static setCameraXy(xy) {
        return BeetPxDraw.#tryGetEngine("setCameraXy").drawApi.setCameraXy(xy);
    }
    /**
     * @returns previous pattern
     */
    static setDrawingPattern(pattern) {
        return BeetPxDraw.#tryGetEngine("setDrawingPattern").drawApi.setDrawingPattern(pattern);
    }
    static pixel(xy, color) {
        BeetPxDraw.#tryGetEngine("pixel").drawApi.drawPixel(xy, color);
    }
    /**
     * Draws pixels based on a visual 2d representation in form of rows
     *   (designated by new lines) where `#` and `-` stand for a colored
     *   pixel and a lack of a pixel. Whitespaces are ignored.
     */
    static pixels(pixels, xy, color, opts) {
        BeetPxDraw.#tryGetEngine("pixels").drawApi.drawPixels(pixels, xy, color, opts);
    }
    static line(xy, wh, color) {
        BeetPxDraw.#tryGetEngine("line").drawApi.drawLine(xy, wh, color);
    }
    static rect(xy, wh, color) {
        BeetPxDraw.#tryGetEngine("rect").drawApi.drawRect(xy, wh, color);
    }
    static rectFilled(xy, wh, color) {
        BeetPxDraw.#tryGetEngine("rectFilled").drawApi.drawRectFilled(xy, wh, color);
    }
    static rectOutsideFilled(xy, wh, color) {
        BeetPxDraw.#tryGetEngine("rectOutsideFilled").drawApi.drawRectOutsideFilled(xy, wh, color);
    }
    static ellipse(xy, wh, color) {
        BeetPxDraw.#tryGetEngine("ellipse").drawApi.drawEllipse(xy, wh, color);
    }
    static ellipseFilled(xy, wh, color) {
        BeetPxDraw.#tryGetEngine("ellipseFilled").drawApi.drawEllipseFilled(xy, wh, color);
    }
    static ellipseOutsideFilled(xy, wh, color) {
        BeetPxDraw.#tryGetEngine("ellipseOutsideFilled").drawApi.drawEllipseOutsideFilled(xy, wh, color);
    }
    /**
     * @returns previous sprite color mapping
     */
    static setSpriteColorMapping(spriteColorMapping) {
        return BeetPxDraw.#tryGetEngine("setSpriteColorMapping").drawApi.setSpriteColorMapping(spriteColorMapping);
    }
    static sprite(sprite, xy, opts) {
        BeetPxDraw.#tryGetEngine("sprite").drawApi.drawSprite(sprite, xy, opts);
    }
    /**
     * @returns - previously used font
     */
    static setFont(font) {
        return BeetPxDraw.#tryGetEngine("setFont").drawApi.setFont(font);
    }
    /**
     * @returns - previously used color markers
     */
    static setTextColorMarkers(textColorMarkers) {
        return BeetPxDraw.#tryGetEngine("setTextColorMarkers").drawApi.setTextColorMarkers(textColorMarkers);
    }
    static measureText(text, opts) {
        return BeetPxDraw.#tryGetEngine("measureText").drawApi.measureText(text, opts);
    }
    static text(text, xy, color, opts) {
        BeetPxDraw.#tryGetEngine("text").drawApi.drawText(text, xy, color, opts);
    }
    static takeCanvasSnapshot() {
        BeetPxDraw.#tryGetEngine("takeCanvasSnapshot").drawApi.takeCanvasSnapshot();
    }
}

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
    /**
     * Number of frames processed since game started.
     * It gets reset to 0 when `BeetPx.restart()` is called.
     * It counts update calls, not draw calls.
     *
     * @return number
     */
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
        return GlobalPause.isActive;
    }
    static get wasJustPaused() {
        return GlobalPause.wasJustActivated;
    }
    static get wasJustResumed() {
        return GlobalPause.wasJustDeactivated;
    }
    static pause() {
        GlobalPause.activate();
    }
    static resume() {
        GlobalPause.deactivate();
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

export const $ = BeetPx;
export const $d = BeetPxDraw;
export const $u = BeetPxUtils;
