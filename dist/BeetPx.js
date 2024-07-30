
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
import { noop } from "./utils/noop";
import { offset4Directions } from "./utils/offset4Directions";
import { offset8Directions } from "./utils/offset8Directions";
import { randomElementOf } from "./utils/randomElementOf";
import { range } from "./utils/range";
import { repeatEachElement } from "./utils/repeatEachElement";
import { throwError } from "./utils/throwError";
import { trigAtan2 } from "./utils/trigAtan2";
import { trigCos } from "./utils/trigCos";
import { trigSin } from "./utils/trigSin";

export class BeetPx {
    
    constructor() { }
    static #engine;
    static #dataStoredBeforeEngineStarted = {};
    static async start(config) {
        if (this.#engine) {
            throw Error("BeetPx is already started");
        }
        Logger.infoBeetPx(`BeetPx ${window.BEETPX__VERSION} : Initializing…`);
        this.#engine = new Engine(config);
        const { startGame } = await this.#engine.init();
        Logger.infoBeetPx(`BeetPx ${window.BEETPX__VERSION} : Initialized`);
        if (this.#dataStoredBeforeEngineStarted.onStarted) {
            this.#engine.setOnStarted(this.#dataStoredBeforeEngineStarted.onStarted);
        }
        if (this.#dataStoredBeforeEngineStarted.onUpdate) {
            this.#engine.setOnUpdate(this.#dataStoredBeforeEngineStarted.onUpdate);
        }
        if (this.#dataStoredBeforeEngineStarted.onDraw) {
            this.#engine.setOnDraw(this.#dataStoredBeforeEngineStarted.onDraw);
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
        if (this.#engine) {
            this.#engine.setOnStarted(onStarted);
        }
        else {
            this.#dataStoredBeforeEngineStarted.onStarted = onStarted;
        }
    }
    static setOnUpdate(onUpdate) {
        if (this.#engine) {
            this.#engine.setOnUpdate(onUpdate);
        }
        else {
            this.#dataStoredBeforeEngineStarted.onUpdate = onUpdate;
        }
    }
    static setOnDraw(onDraw) {
        if (this.#engine) {
            this.#engine.setOnDraw(onDraw);
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
    
    
    
    static #tryGetEngine(drawFnNameToLogIfOutsideDrawCallback) {
        if (!this.#engine) {
            throw Error(`Tried to access BeetPx API without calling BeetPx.start(…) first.`);
        }
        if (drawFnNameToLogIfOutsideDrawCallback &&
            !this.#engine.isInsideDrawOrStartedCallback) {
            Logger.warnBeetPx(`Used "${drawFnNameToLogIfOutsideDrawCallback}" outside of either "setOnDraw" or "setOnStarted" callback.`);
        }
        return this.#engine;
    }
    
    
    
    static draw = {
        clearCanvas(color) {
            BeetPx.#tryGetEngine("clearCanvas").drawApi.clearCanvas(color);
        },
        /**
         * @returns - previous clipping region in form of an array: [xy, wh]
         */
        setClippingRegion(xy, wh) {
            return BeetPx.#tryGetEngine("setClippingRegion").drawApi.setClippingRegion(xy, wh);
        },
        /**
         * @returns - previous clipping region in form of an array: [xy, wh]
         */
        removeClippingRegion() {
            return BeetPx.#tryGetEngine("removeClippingRegion").drawApi.removeClippingRegion();
        },
        /**
         * Sets a new XY (left-top corner) of a camera's viewport
         *
         * @returns previous camera XY
         */
        setCameraXy(xy) {
            return BeetPx.#tryGetEngine("setCameraXy").drawApi.setCameraXy(xy);
        },
        /**
         * @returns previous pattern
         */
        setDrawingPattern(pattern) {
            return BeetPx.#tryGetEngine("setDrawingPattern").drawApi.setDrawingPattern(pattern);
        },
        pixel(xy, color) {
            BeetPx.#tryGetEngine("pixel").drawApi.drawPixel(xy, color);
        },
        /**
         * Draws pixels based on a visual 2d representation in form of rows
         *   (designated by new lines) where `#` and `-` stand for a colored
         *   pixel and a lack of a pixel. Whitespaces are ignored.
         */
        pixels(pixels, xy, color, opts) {
            BeetPx.#tryGetEngine("pixels").drawApi.drawPixels(pixels, xy, color, opts);
        },
        line(xy, wh, color) {
            BeetPx.#tryGetEngine("line").drawApi.drawLine(xy, wh, color);
        },
        rect(xy, wh, color) {
            BeetPx.#tryGetEngine("rect").drawApi.drawRect(xy, wh, color);
        },
        rectFilled(xy, wh, color) {
            BeetPx.#tryGetEngine("rectFilled").drawApi.drawRectFilled(xy, wh, color);
        },
        rectOutsideFilled(xy, wh, color) {
            BeetPx.#tryGetEngine("rectOutsideFilled").drawApi.drawRectOutsideFilled(xy, wh, color);
        },
        ellipse(xy, wh, color) {
            BeetPx.#tryGetEngine("ellipse").drawApi.drawEllipse(xy, wh, color);
        },
        ellipseFilled(xy, wh, color) {
            BeetPx.#tryGetEngine("ellipseFilled").drawApi.drawEllipseFilled(xy, wh, color);
        },
        ellipseOutsideFilled(xy, wh, color) {
            BeetPx.#tryGetEngine("ellipseOutsideFilled").drawApi.drawEllipseOutsideFilled(xy, wh, color);
        },
        /**
         * @returns previous sprite color mapping
         */
        setSpriteColorMapping(spriteColorMapping) {
            return BeetPx.#tryGetEngine("setSpriteColorMapping").drawApi.setSpriteColorMapping(spriteColorMapping);
        },
        sprite(sprite, xy, opts) {
            BeetPx.#tryGetEngine("sprite").drawApi.drawSprite(sprite, xy, opts);
        },
        /**
         * @returns - previously used font
         */
        setFont(font) {
            return BeetPx.#tryGetEngine("setFont").drawApi.setFont(font);
        },
        /**
         * @returns - previously used color markers
         */
        setTextColorMarkers(textColorMarkers) {
            return BeetPx.#tryGetEngine("setTextColorMarkers").drawApi.setTextColorMarkers(textColorMarkers);
        },
        measureText(text, opts) {
            return BeetPx.#tryGetEngine("measureText").drawApi.measureText(text, opts);
        },
        text(text, xy, color, opts) {
            BeetPx.#tryGetEngine("text").drawApi.drawText(text, xy, color, opts);
        },
        takeCanvasSnapshot() {
            BeetPx.#tryGetEngine("takeCanvasSnapshot").drawApi.takeCanvasSnapshot();
        },
    };
    
    
    
    static utils = {
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
        assertUnreachable,
        booleanChangingEveryNthFrame,
        /**
         * Returns the middle number. Example usage: `clamp(min, value, max)`
         *   in order to find a value which is:
         *   - `value` if it is `>= min` and `<= max`
         *   - `min` if `value` is `< min`
         *   - `max` if `value` is `> max`
         */
        clamp,
        drawTextWithOutline,
        identity,
        lerp,
        /**
         * a modulo operation – in contrary to native `%`, this returns results from [0, n) range (positive values only)
         */
        mod,
        noop,
        /**
         * Generates a list of XY to add to a given coordinate in order to get all offsets by 1 pixel in 4 directions.
         */
        offset4Directions,
        /**
         * Generates a list of XY to add to a given coordinate in order to get all offsets by 1 pixel in 8 directions.
         */
        offset8Directions,
        randomElementOf,
        range,
        repeatEachElement,
        /**
         * To be used as a value, e.g. in `definedValue: maybeUndefined() ?? throwError("…")`.
         */
        throwError,
        /**
         * @return turn angle. A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
         */
        trigAtan2,
        /**
         * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
         */
        trigCos(turnAngle) {
            return trigCos(turnAngle);
        },
        /**
         * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
         */
        trigSin,
    };
}

export const $ = BeetPx;
export const $d = BeetPx.draw;
export const $u = BeetPx.utils;
