
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
    
    
    
    static setOnStarted = (onStarted) => {
        if (this.#engine) {
            this.#engine.setOnStarted(onStarted);
        }
        else {
            this.#dataStoredBeforeEngineStarted.onStarted = onStarted;
        }
    };
    static setOnUpdate = (onUpdate) => {
        if (this.#engine) {
            this.#engine.setOnUpdate(onUpdate);
        }
        else {
            this.#dataStoredBeforeEngineStarted.onUpdate = onUpdate;
        }
    };
    static setOnDraw = (onDraw) => {
        if (this.#engine) {
            this.#engine.setOnDraw(onDraw);
        }
        else {
            this.#dataStoredBeforeEngineStarted.onDraw = onDraw;
        }
    };
    static restart = (...args) => {
        return this.#tryGetEngine().restart(...args);
    };
    
    
    
    static logDebug = (...args) => {
        return Logger.debug(...args);
    };
    static logInfo = (...args) => {
        return Logger.info(...args);
    };
    static logWarn = (...args) => {
        return Logger.warn(...args);
    };
    static logError = (...args) => {
        return Logger.error(...args);
    };
    
    
    
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
    
    
    
    static wasAnyButtonJustPressed = (...args) => {
        return this.#tryGetEngine().gameInput.gameButtons.wasAnyJustPressed(...args);
    };
    static wasButtonJustPressed = (...args) => {
        return this.#tryGetEngine().gameInput.gameButtons.wasJustPressed(...args);
    };
    static wasButtonJustReleased = (...args) => {
        return this.#tryGetEngine().gameInput.gameButtons.wasJustReleased(...args);
    };
    static isAnyButtonPressed = (...args) => {
        return this.#tryGetEngine().gameInput.gameButtons.isAnyPressed(...args);
    };
    static isButtonPressed = (...args) => {
        return this.#tryGetEngine().gameInput.gameButtons.isPressed(...args);
    };
    static getPressedDirection = (...args) => {
        return this.#tryGetEngine().gameInput.gameButtons.getPressedDirection(...args);
    };
    static setButtonRepeating = (...args) => {
        return this.#tryGetEngine().gameInput.gameButtons.setButtonRepeating(...args);
    };
    static getRecentInputMethods = (...args) => {
        return this.#tryGetEngine().gameInput.getRecentInputMethods(...args);
    };
    static getConnectedGamepadTypes = (...args) => {
        return this.#tryGetEngine().gameInput.getConnectedGamepadTypes(...args);
    };
    static getEventsCapturedInLastUpdate = (...args) => {
        return this.#tryGetEngine().gameInput.getEventsCapturedInLastUpdate(...args);
    };
    
    
    
    static isAudioMuted = (...args) => {
        return this.#tryGetEngine().audioApi.isAudioMuted(...args);
    };
    static muteAudio = (...args) => {
        return this.#tryGetEngine().audioApi.muteAudio(...args);
    };
    static unmuteAudio = (...args) => {
        return this.#tryGetEngine().audioApi.unmuteAudio(...args);
    };
    static startPlayback = (...args) => {
        return this.#tryGetEngine().audioApi.startPlayback(...args);
    };
    static startPlaybackLooped = (...args) => {
        return this.#tryGetEngine().audioApi.startPlaybackLooped(...args);
    };
    static startPlaybackSequence = (...args) => {
        return this.#tryGetEngine().audioApi.startPlaybackSequence(...args);
    };
    static mutePlayback = (...args) => {
        return this.#tryGetEngine().audioApi.mutePlayback(...args);
    };
    static unmutePlayback = (...args) => {
        return this.#tryGetEngine().audioApi.unmutePlayback(...args);
    };
    static stopPlayback = (...args) => {
        return this.#tryGetEngine().audioApi.stopPlayback(...args);
    };
    static pausePlayback = (...args) => {
        return this.#tryGetEngine().audioApi.pausePlayback(...args);
    };
    static resumePlayback = (...args) => {
        return this.#tryGetEngine().audioApi.resumePlayback(...args);
    };
    static getAudioContext = (...args) => {
        return this.#tryGetEngine().audioApi.getAudioContext(...args);
    };
    
    
    
    static isFullScreenSupported = (...args) => {
        return this.#tryGetEngine().fullScreen.isFullScreenSupported(...args);
    };
    static isInFullScreen = (...args) => {
        return this.#tryGetEngine().fullScreen.isInFullScreen(...args);
    };
    static toggleFullScreen = (...args) => {
        return this.#tryGetEngine().fullScreen.toggleFullScreen(...args);
    };
    
    
    
    static savePersistedState = (...args) => {
        return this.#tryGetEngine().storageApi.savePersistedState(...args);
    };
    static loadPersistedState = (...args) => {
        return this.#tryGetEngine().storageApi.loadPersistedState(...args);
    };
    static clearPersistedState = (...args) => {
        return this.#tryGetEngine().storageApi.clearPersistedState(...args);
    };
    
    
    
    static getImageAsset = (...args) => {
        return this.#tryGetEngine().assets.getImageAsset(...args);
    };
    static getSoundAsset = (...args) => {
        return this.#tryGetEngine().assets.getSoundAsset(...args);
    };
    static getJsonAsset = (...args) => {
        return this.#tryGetEngine().assets.getJsonAsset(...args);
    };
    
    
    
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
        useFont(font) {
            return BeetPx.#tryGetEngine("useFont").drawApi.useFont(font);
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
        assertUnreachable,
        booleanChangingEveryNthFrame,
        clamp,
        drawTextWithOutline,
        identity,
        lerp,
        mod,
        noop,
        offset4Directions,
        offset8Directions,
        randomElementOf,
        range,
        repeatEachElement,
        throwError,
        trigAtan2,
        trigCos,
        trigSin,
    };
}

export const $ = BeetPx;
export const $d = BeetPx.draw;
export const $u = BeetPx.utils;
