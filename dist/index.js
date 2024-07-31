/**
 * For TypeDoc:
 * @module API
 */

import { Engine } from "./Engine";
import { BpxCanvasSnapshotColorMapping } from "./color/CanvasSnapshotColorMapping";
import { BpxPalettePico8 } from "./color/PalettePico8";
import { BpxPatternColors } from "./color/PatternColors";
import { BpxRgbColor } from "./color/RgbColor";
import { BpxSpriteColorMapping } from "./color/SpriteColorMapping";
import { DebugMode } from "./debug/DebugMode";
import { BpxDrawingPattern } from "./draw_api/DrawingPattern";
import { BpxPixels } from "./draw_api/Pixels";
import { BpxFont } from "./font/Font";
import { BpxFontConfigPico8 } from "./font/FontConfigPico8";
import { BpxFontConfigSaint11Minimal4 } from "./font/FontConfigSaint11Minimal4";
import { BpxFontConfigSaint11Minimal5 } from "./font/FontConfigSaint11Minimal5";
import { BpxGamepadTypeDetector } from "./game_input/GamepadTypeDetector";
import { Logger } from "./logger/Logger";
import { BpxEasing } from "./misc/Easing";
import { BpxVector2d } from "./misc/Vector2d";
import { GamePause } from "./pause/GamePause";
import { BpxAnimatedSprite } from "./sprite/AnimatedSprite";
import { BpxSprite } from "./sprite/Sprite";
import { BpxTimer } from "./timer/Timer";
import { BpxTimerSequence } from "./timer/TimerSequence";
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

/**
 * @category API entry points
 */
export class BeetPx {
    constructor() { }
    static #dataStoredBeforeEngineStarted = {};
    static #tryGetEngine() {
        if (!Engine.engineSingleton) {
            throw Error(`Tried to access BeetPx API without calling BeetPx.start(…) first.`);
        }
        return Engine.engineSingleton;
    }
    
    
    
    /**
     * @category Lifecycle
     */
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
    
    
    
    /**
     * @category Lifecycle
     */
    static setOnStarted(onStarted) {
        if (Engine.engineSingleton) {
            Engine.engineSingleton.setOnStarted(onStarted);
        }
        else {
            this.#dataStoredBeforeEngineStarted.onStarted = onStarted;
        }
    }
    /**
     * @category Lifecycle
     */
    static setOnUpdate(onUpdate) {
        if (Engine.engineSingleton) {
            Engine.engineSingleton.setOnUpdate(onUpdate);
        }
        else {
            this.#dataStoredBeforeEngineStarted.onUpdate = onUpdate;
        }
    }
    /**
     * @category Lifecycle
     */
    static setOnDraw(onDraw) {
        if (Engine.engineSingleton) {
            Engine.engineSingleton.setOnDraw(onDraw);
        }
        else {
            this.#dataStoredBeforeEngineStarted.onDraw = onDraw;
        }
    }
    /**
     * @category Lifecycle
     */
    static restart() {
        this.#tryGetEngine().restart();
    }
    
    
    
    /**
     * @category Logging
     */
    static logDebug(...args) {
        Logger.debug(...args);
    }
    /**
     * @category Logging
     */
    static logInfo(...args) {
        Logger.info(...args);
    }
    /**
     * @category Logging
     */
    static logWarn(...args) {
        Logger.warn(...args);
    }
    /**
     * @category Logging
     */
    static logError(...args) {
        Logger.error(...args);
    }
    
    
    
    /**
     * @category Game pause
     */
    static get isPaused() {
        return GamePause.isActive;
    }
    /**
     * @category Game pause
     */
    static get wasJustPaused() {
        return GamePause.wasJustActivated;
    }
    /**
     * @category Game pause
     */
    static get wasJustResumed() {
        return GamePause.wasJustDeactivated;
    }
    /**
     * @category Game pause
     */
    static pause() {
        GamePause.activate();
    }
    /**
     * @category Game pause
     */
    static resume() {
        GamePause.deactivate();
    }
    
    
    
    /**
     * @category Game input
     */
    static wasAnyButtonJustPressed() {
        return this.#tryGetEngine().gameInput.gameButtons.wasAnyJustPressed();
    }
    /**
     * @category Game input
     */
    static wasButtonJustPressed(button) {
        return this.#tryGetEngine().gameInput.gameButtons.wasJustPressed(button);
    }
    /**
     * @category Game input
     */
    static wasButtonJustReleased(button) {
        return this.#tryGetEngine().gameInput.gameButtons.wasJustReleased(button);
    }
    /**
     * @category Game input
     */
    static isAnyButtonPressed() {
        return this.#tryGetEngine().gameInput.gameButtons.isAnyPressed();
    }
    /**
     * @category Game input
     */
    static isButtonPressed(button) {
        return this.#tryGetEngine().gameInput.gameButtons.isPressed(button);
    }
    /**
     * @category Game input
     * @example
     * ```ts
     * this.position += $.getPressedDirection().mul(this.speed);
     * ```
     */
    static getPressedDirection() {
        return this.#tryGetEngine().gameInput.gameButtons.getPressedDirection();
    }
    /**
     * @category Game input
     */
    static setButtonRepeating(button, repeating) {
        this.#tryGetEngine().gameInput.gameButtons.setButtonRepeating(button, repeating);
    }
    /**
     * @category Game input
     */
    static getRecentInputMethods() {
        return this.#tryGetEngine().gameInput.getRecentInputMethods();
    }
    /**
     * @category Game input
     */
    static getConnectedGamepadTypes() {
        return this.#tryGetEngine().gameInput.getConnectedGamepadTypes();
    }
    /**
     * @category Game input
     */
    static getEventsCapturedInLastUpdate() {
        return this.#tryGetEngine().gameInput.getEventsCapturedInLastUpdate();
    }
    
    
    
    /**
     * @category Audio
     */
    static isAudioMuted() {
        return this.#tryGetEngine().audioApi.isAudioMuted();
    }
    /**
     * @category Audio
     */
    static muteAudio(opts) {
        this.#tryGetEngine().audioApi.muteAudio(opts);
    }
    /**
     * @category Audio
     */
    static unmuteAudio(opts) {
        this.#tryGetEngine().audioApi.unmuteAudio(opts);
    }
    /**
     * @category Audio
     */
    static startPlayback(soundUrl, opts) {
        return this.#tryGetEngine().audioApi.startPlayback(soundUrl, opts);
    }
    /**
     * @category Audio
     */
    static startPlaybackLooped(soundUrl, opts) {
        return this.#tryGetEngine().audioApi.startPlaybackLooped(soundUrl, opts);
    }
    /**
     * @category Audio
     */
    static startPlaybackSequence(soundSequence, opts) {
        return this.#tryGetEngine().audioApi.startPlaybackSequence(soundSequence, opts);
    }
    /**
     * @category Audio
     */
    static mutePlayback(playbackId, opts) {
        this.#tryGetEngine().audioApi.mutePlayback(playbackId, opts);
    }
    /**
     * @category Audio
     */
    static unmutePlayback(playbackId, opts) {
        this.#tryGetEngine().audioApi.unmutePlayback(playbackId, opts);
    }
    /**
     * @category Audio
     */
    static stopPlayback(playbackId, opts) {
        this.#tryGetEngine().audioApi.stopPlayback(playbackId, opts);
    }
    /**
     * @category Audio
     */
    static pausePlayback(playbackId) {
        this.#tryGetEngine().audioApi.pausePlayback(playbackId);
    }
    /**
     * @category Audio
     */
    static resumePlayback(playbackId) {
        this.#tryGetEngine().audioApi.resumePlayback(playbackId);
    }
    /**
     * @category Audio
     */
    static getAudioContext() {
        return this.#tryGetEngine().audioApi.getAudioContext();
    }
    
    
    
    /**
     * @category Full screen
     */
    static isFullScreenSupported() {
        return this.#tryGetEngine().fullScreen.isFullScreenSupported();
    }
    /**
     * @category Full screen
     */
    static isInFullScreen() {
        return this.#tryGetEngine().fullScreen.isInFullScreen();
    }
    /**
     * @category Full screen
     */
    static toggleFullScreen() {
        this.#tryGetEngine().fullScreen.toggleFullScreen();
    }
    
    
    
    /**
     * @category Storage
     */
    static savePersistedState(value) {
        this.#tryGetEngine().storageApi.savePersistedState(value);
    }
    /**
     * @category Storage
     */
    static loadPersistedState() {
        return this.#tryGetEngine().storageApi.loadPersistedState();
    }
    /**
     * @category Storage
     */
    static clearPersistedState() {
        this.#tryGetEngine().storageApi.clearPersistedState();
    }
    
    
    
    /**
     * @category Assets
     */
    static getImageAsset(imageUrl) {
        return this.#tryGetEngine().assets.getImageAsset(imageUrl);
    }
    /**
     * @category Assets
     */
    static getSoundAsset(soundUrl) {
        return this.#tryGetEngine().assets.getSoundAsset(soundUrl);
    }
    /**
     * @category Assets
     */
    static getJsonAsset(jsonUrl) {
        return this.#tryGetEngine().assets.getJsonAsset(jsonUrl);
    }
}

/**
 * @category API entry points
 */
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
     * @category Fonts
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

/**
 * @category API entry points
 */
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

export { BpxAnimatedSprite, BpxCanvasSnapshotColorMapping, BpxDrawingPattern, BpxEasing, BpxFont, BpxFontConfigPico8, BpxFontConfigSaint11Minimal4, BpxFontConfigSaint11Minimal5, BpxGamepadTypeDetector, BpxPalettePico8, BpxPatternColors, BpxPixels, BpxRgbColor, BpxSprite, BpxSpriteColorMapping, BpxTimer, BpxTimerSequence, BpxVector2d, };

export const $ = BeetPx;
export const $d = BeetPxDraw;
export const $u = BeetPxUtils;

export * from "./shorthands";
