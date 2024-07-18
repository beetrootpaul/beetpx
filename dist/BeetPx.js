
import { Engine } from "./Engine";
import { DebugMode } from "./debug/DebugMode";
import { Logger } from "./logger/Logger";
import { GlobalPause } from "./pause/GlobalPause";

export class BeetPx {
    static #engine;
    
    
    
    static async init(config) {
        Logger.infoBeetPx(`BeetPx ${window.BEETPX__VERSION} : Initializing…`);
        this.#engine = new Engine(config);
        const { startGame } = await this.#engine.init();
        Logger.infoBeetPx(`BeetPx ${window.BEETPX__VERSION} : Initialized`);
        return { startGame };
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
    
    
    
    static setOnStarted = (...args) => {
        return this.#tryGetEngine().setOnStarted(...args);
    };
    static setOnUpdate = (...args) => {
        return this.#tryGetEngine().setOnUpdate(...args);
    };
    static setOnDraw = (...args) => {
        return this.#tryGetEngine().setOnDraw(...args);
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
    
    
    
    static clearCanvas = (...args) => {
        return this.#tryGetEngine().drawApi.clearCanvas(...args);
    };
    /**
     * @returns - previous clipping region in form of an array: [xy, wh]
     */
    static setClippingRegion = (...args) => {
        return this.#tryGetEngine().drawApi.setClippingRegion(...args);
    };
    /**
     * @returns - previous clipping region in form of an array: [xy, wh]
     */
    static removeClippingRegion = (...args) => {
        return this.#tryGetEngine().drawApi.removeClippingRegion(...args);
    };
    /**
     * Sets a new XY (left-top corner) of a camera's viewport
     *
     * @returns previous camera XY
     */
    static setCameraXy = (...args) => {
        return this.#tryGetEngine().drawApi.setCameraXy(...args);
    };
    /**
     * @returns previous pattern
     */
    static setDrawingPattern = (...args) => {
        return this.#tryGetEngine().drawApi.setDrawingPattern(...args);
    };
    static drawPixel = (...args) => {
        return this.#tryGetEngine().drawApi.drawPixel(...args);
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
    static drawPixels = (...args) => {
        return this.#tryGetEngine().drawApi.drawPixels(...args);
    };
    static drawLine = (...args) => {
        return this.#tryGetEngine().drawApi.drawLine(...args);
    };
    static drawRect = (...args) => {
        return this.#tryGetEngine().drawApi.drawRect(...args);
    };
    static drawRectFilled = (...args) => {
        return this.#tryGetEngine().drawApi.drawRectFilled(...args);
    };
    static drawRectOutsideFilled = (...args) => {
        return this.#tryGetEngine().drawApi.drawRectOutsideFilled(...args);
    };
    static drawEllipse = (...args) => {
        return this.#tryGetEngine().drawApi.drawEllipse(...args);
    };
    static drawEllipseFilled = (...args) => {
        return this.#tryGetEngine().drawApi.drawEllipseFilled(...args);
    };
    static drawEllipseOutsideFilled = (...args) => {
        return this.#tryGetEngine().drawApi.drawEllipseOutsideFilled(...args);
    };
    /**
     * @returns previous sprite color mapping
     */
    static setSpriteColorMapping = (...args) => {
        return this.#tryGetEngine().drawApi.setSpriteColorMapping(...args);
    };
    static drawSprite = (...args) => {
        return this.#tryGetEngine().drawApi.drawSprite(...args);
    };
    static useFont = (...args) => {
        return this.#tryGetEngine().drawApi.useFont(...args);
    };
    static measureText = (...args) => {
        return this.#tryGetEngine().drawApi.measureText(...args);
    };
    static drawText = (...args) => {
        return this.#tryGetEngine().drawApi.drawText(...args);
    };
    static takeCanvasSnapshot = (...args) => {
        return this.#tryGetEngine().drawApi.takeCanvasSnapshot(...args);
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
    
    
    
    static #tryGetEngine() {
        if (!this.#engine) {
            throw Error(`Tried to access BeetPx API without calling BeetPx.init(…) first.`);
        }
        return this.#engine;
    }
}

export const b_ = BeetPx;
