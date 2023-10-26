var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Framework_instances, _a, _Framework_storageDebugDisabledKey, _Framework_storageDebugDisabledTrue, _Framework_frameByFrame, _Framework_browserType, _Framework_gameCanvasSize, _Framework_htmlCanvasBackground, _Framework_htmlCanvasContext, _Framework_offscreenContext, _Framework_offscreenImageData, _Framework_loading, _Framework_gameLoop, _Framework_fullScreen, _Framework_canvasPixels, _Framework_onStarted, _Framework_onUpdate, _Framework_onDraw, _Framework_scaleToFill, _Framework_centeringOffset, _Framework_frameNumber, _Framework_renderFps, _Framework_alreadyResumedAudioContext, _Framework_initializeAsNonTransparent, _Framework_startGame, _Framework_setupHtmlCanvas, _Framework_render, _Framework_redrawDebugMargin;
import { Assets } from "./Assets";
import { BeetPx } from "./BeetPx";
import { BpxSolidColor, black_ } from "./Color";
import { FullScreen } from "./FullScreen";
import { HtmlTemplate } from "./HtmlTemplate";
import { Loading } from "./Loading";
import { BpxUtils } from "./Utils";
import { v_, v_0_0_ } from "./Vector2d";
import { AudioApi } from "./audio/AudioApi";
import { BrowserTypeDetector, } from "./browser/BrowserTypeDetector";
import { DebugMode } from "./debug/DebugMode";
import { CanvasPixels } from "./draw_api/CanvasPixels";
import { DrawApi } from "./draw_api/DrawApi";
import { GameInput } from "./game_input/GameInput";
import { GameLoop } from "./game_loop/GameLoop";
import { Logger } from "./logger/Logger";
import { StorageApi } from "./storage/StorageApi";
export class Framework {
    get frameNumber() {
        return __classPrivateFieldGet(this, _Framework_frameNumber, "f");
    }
    get renderFps() {
        return __classPrivateFieldGet(this, _Framework_renderFps, "f");
    }
    constructor(options) {
        _Framework_instances.add(this);
        _Framework_frameByFrame.set(this, void 0);
        _Framework_browserType.set(this, void 0);
        _Framework_gameCanvasSize.set(this, void 0);
        _Framework_htmlCanvasBackground.set(this, BpxSolidColor.fromRgbCssHex("#000000"));
        _Framework_htmlCanvasContext.set(this, void 0);
        _Framework_offscreenContext.set(this, void 0);
        _Framework_offscreenImageData.set(this, void 0);
        _Framework_loading.set(this, void 0);
        _Framework_gameLoop.set(this, void 0);
        _Framework_fullScreen.set(this, void 0);
        _Framework_canvasPixels.set(this, void 0);
        _Framework_onStarted.set(this, void 0);
        _Framework_onUpdate.set(this, void 0);
        _Framework_onDraw.set(this, void 0);
        _Framework_scaleToFill.set(this, 1);
        _Framework_centeringOffset.set(this, v_0_0_);
        _Framework_frameNumber.set(this, 0);
        _Framework_renderFps.set(this, 1);
        // used to indicate whether the AudioContext resume succeeded. It might have been false for the entire
        _Framework_alreadyResumedAudioContext.set(this, false);
        DebugMode.enabled = options.debugFeatures
            ? window.localStorage.getItem(__classPrivateFieldGet(Framework, _a, "f", _Framework_storageDebugDisabledKey)) !==
                __classPrivateFieldGet(Framework, _a, "f", _Framework_storageDebugDisabledTrue)
            : false;
        __classPrivateFieldSet(this, _Framework_frameByFrame, false, "f");
        __classPrivateFieldSet(this, _Framework_browserType, BrowserTypeDetector.detect(navigator.userAgent), "f");
        __classPrivateFieldSet(this, _Framework_loading, new Loading(HtmlTemplate.selectors.display), "f");
        __classPrivateFieldSet(this, _Framework_gameCanvasSize, options.gameCanvasSize === "64x64"
            ? v_(64, 64)
            : options.gameCanvasSize === "128x128"
                ? v_(128, 128)
                : BpxUtils.throwError(`Unsupported canvas size: "${options.gameCanvasSize}"`), "f");
        const htmlCanvas = document.querySelector(HtmlTemplate.selectors.canvas);
        if (!htmlCanvas) {
            throw Error(`Was unable to find <canvas> by selector '${HtmlTemplate.selectors.canvas}'`);
        }
        const htmlCanvasContext = htmlCanvas.getContext("2d", {
            // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#turn_off_transparency
            alpha: false,
        });
        if (!htmlCanvasContext) {
            throw Error("Was unable to obtain <canvas>' 2D context");
        }
        __classPrivateFieldSet(this, _Framework_htmlCanvasContext, htmlCanvasContext, "f");
        const offscreenCanvas = document
            .createElement("canvas")
            .transferControlToOffscreen();
        offscreenCanvas.width = __classPrivateFieldGet(this, _Framework_gameCanvasSize, "f").x;
        offscreenCanvas.height = __classPrivateFieldGet(this, _Framework_gameCanvasSize, "f").y;
        const offscreenContext = offscreenCanvas.getContext("2d", {
            // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#turn_off_transparency
            alpha: false,
        });
        if (!offscreenContext) {
            throw Error("Was unable to obtain OffscreenCanvas' 2D context");
        }
        __classPrivateFieldSet(this, _Framework_offscreenContext, offscreenContext, "f");
        this.gameInput = new GameInput({
            visibleTouchButtons: options.visibleTouchButtons,
            // TODO: are those selectors for both touch and mouse? Even if so, make them separate
            muteButtonsSelector: HtmlTemplate.selectors.controlsMuteToggle,
            // TODO: are those selectors for both touch and mouse? Even if so, make them separate
            fullScreenButtonsSelector: HtmlTemplate.selectors.controlsFullScreen,
            enableDebugInputs: options.debugFeatures,
            browserType: __classPrivateFieldGet(this, _Framework_browserType, "f"),
        });
        __classPrivateFieldSet(this, _Framework_gameLoop, new GameLoop({
            desiredUpdateFps: options.desiredUpdateFps,
            requestAnimationFrameFn: window.requestAnimationFrame.bind(window),
            documentVisibilityStateProvider: document,
        }), "f");
        this.storageApi = new StorageApi();
        const audioContext = new AudioContext();
        this.assets = new Assets({
            decodeAudioData: (arrayBuffer) => audioContext.decodeAudioData(arrayBuffer),
        });
        this.audioApi = new AudioApi(this.assets, audioContext);
        __classPrivateFieldSet(this, _Framework_fullScreen, FullScreen.newFor(HtmlTemplate.selectors.display, HtmlTemplate.selectors.controlsFullScreen), "f");
        __classPrivateFieldSet(this, _Framework_offscreenImageData, __classPrivateFieldGet(this, _Framework_offscreenContext, "f").createImageData(__classPrivateFieldGet(this, _Framework_offscreenContext, "f").canvas.width, __classPrivateFieldGet(this, _Framework_offscreenContext, "f").canvas.height), "f");
        __classPrivateFieldGet(this, _Framework_instances, "m", _Framework_initializeAsNonTransparent).call(this, __classPrivateFieldGet(this, _Framework_offscreenImageData, "f"));
        __classPrivateFieldSet(this, _Framework_canvasPixels, new CanvasPixels(__classPrivateFieldGet(this, _Framework_gameCanvasSize, "f")), "f");
        this.drawApi = new DrawApi({
            canvasPixels: __classPrivateFieldGet(this, _Framework_canvasPixels, "f"),
            assets: this.assets,
        });
    }
    detectedBrowserType() {
        return __classPrivateFieldGet(this, _Framework_browserType, "f");
    }
    loadAssets(assetsToLoad) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.assets.loadAssets(assetsToLoad).then(() => {
                Logger.infoBeetPx("initialized");
                return {
                    startGame: __classPrivateFieldGet(this, _Framework_instances, "m", _Framework_startGame).bind(this),
                };
            });
        });
    }
    setOnStarted(onStarted) {
        __classPrivateFieldSet(this, _Framework_onStarted, onStarted, "f");
    }
    setOnUpdate(onUpdate) {
        __classPrivateFieldSet(this, _Framework_onUpdate, onUpdate, "f");
    }
    setOnDraw(onDraw) {
        __classPrivateFieldSet(this, _Framework_onDraw, onDraw, "f");
    }
    restart() {
        var _b;
        __classPrivateFieldSet(this, _Framework_frameNumber, 0, "f");
        this.audioApi.restart();
        BeetPx.clearCanvas(black_);
        (_b = __classPrivateFieldGet(this, _Framework_onStarted, "f")) === null || _b === void 0 ? void 0 : _b.call(this);
    }
}
_a = Framework, _Framework_frameByFrame = new WeakMap(), _Framework_browserType = new WeakMap(), _Framework_gameCanvasSize = new WeakMap(), _Framework_htmlCanvasBackground = new WeakMap(), _Framework_htmlCanvasContext = new WeakMap(), _Framework_offscreenContext = new WeakMap(), _Framework_offscreenImageData = new WeakMap(), _Framework_loading = new WeakMap(), _Framework_gameLoop = new WeakMap(), _Framework_fullScreen = new WeakMap(), _Framework_canvasPixels = new WeakMap(), _Framework_onStarted = new WeakMap(), _Framework_onUpdate = new WeakMap(), _Framework_onDraw = new WeakMap(), _Framework_scaleToFill = new WeakMap(), _Framework_centeringOffset = new WeakMap(), _Framework_frameNumber = new WeakMap(), _Framework_renderFps = new WeakMap(), _Framework_alreadyResumedAudioContext = new WeakMap(), _Framework_instances = new WeakSet(), _Framework_initializeAsNonTransparent = function _Framework_initializeAsNonTransparent(imageData) {
    for (let i = 3; i < imageData.data.length; i += 4) {
        imageData.data[i] = 0xff;
    }
}, _Framework_startGame = function _Framework_startGame() {
    var _b;
    if (__BEETPX_IS_PROD__) {
        // A popup which prevents user from accidentally closing the browser tab during gameplay.
        // Implementation notes:
        // - returned message seems to be ignored by some browsers, therefore using `""`
        // - this event is *not* always run when for example there was no mouse click inside
        //   iframe with the game in Firefox
        // - there are two ways of implementing this, because of browsers incompatibilities,
        //   therefore using both of them here (`event.returnValue =` and `return`)
        window.addEventListener("beforeunload", (event) => {
            event.preventDefault();
            event.returnValue = "";
            return "";
        });
    }
    __classPrivateFieldGet(this, _Framework_instances, "m", _Framework_setupHtmlCanvas).call(this);
    window.addEventListener("resize", (_event) => {
        __classPrivateFieldGet(this, _Framework_instances, "m", _Framework_setupHtmlCanvas).call(this);
    });
    __classPrivateFieldSet(this, _Framework_frameNumber, 0, "f");
    (_b = __classPrivateFieldGet(this, _Framework_onStarted, "f")) === null || _b === void 0 ? void 0 : _b.call(this);
    __classPrivateFieldGet(this, _Framework_loading, "f").showApp();
    this.gameInput.startListening();
    __classPrivateFieldGet(this, _Framework_gameLoop, "f").start({
        updateFn: () => {
            var _b;
            if (this.gameInput.buttonFullScreen.wasJustPressed(false)) {
                __classPrivateFieldGet(this, _Framework_fullScreen, "f").toggle();
            }
            if (this.gameInput.buttonMuteUnmute.wasJustPressed(false)) {
                if (this.audioApi.isAudioMuted()) {
                    this.audioApi.unmuteAudio();
                }
                else {
                    this.audioApi.muteAudio();
                }
            }
            if (this.gameInput.buttonDebugToggle.wasJustPressed(false)) {
                DebugMode.enabled = !DebugMode.enabled;
                if (DebugMode.enabled) {
                    window.localStorage.removeItem(__classPrivateFieldGet(Framework, _a, "f", _Framework_storageDebugDisabledKey));
                }
                else {
                    window.localStorage.setItem(__classPrivateFieldGet(Framework, _a, "f", _Framework_storageDebugDisabledKey), __classPrivateFieldGet(Framework, _a, "f", _Framework_storageDebugDisabledTrue));
                }
                __classPrivateFieldGet(this, _Framework_instances, "m", _Framework_redrawDebugMargin).call(this);
            }
            if (this.gameInput.buttonFrameByFrameToggle.wasJustPressed(false)) {
                __classPrivateFieldSet(this, _Framework_frameByFrame, !__classPrivateFieldGet(this, _Framework_frameByFrame, "f"), "f");
                Logger.infoBeetPx(`FrameByFrame mode set to: ${__classPrivateFieldGet(this, _Framework_frameByFrame, "f")}`);
            }
            const shouldUpdate = !__classPrivateFieldGet(this, _Framework_frameByFrame, "f") ||
                this.gameInput.buttonFrameByFrameStep.wasJustPressed(false);
            const hasAnyInteractionHappened = this.gameInput.update({
                skipGameButtons: !shouldUpdate,
            });
            if (hasAnyInteractionHappened && !__classPrivateFieldGet(this, _Framework_alreadyResumedAudioContext, "f")) {
                this.audioApi
                    .tryToResumeAudioContextSuspendedByBrowserForSecurityReasons()
                    .then((resumed) => {
                    if (resumed) {
                        __classPrivateFieldSet(this, _Framework_alreadyResumedAudioContext, true, "f");
                    }
                });
            }
            if (shouldUpdate) {
                if (__classPrivateFieldGet(this, _Framework_frameByFrame, "f")) {
                    Logger.infoBeetPx(`Running onUpdate for frame: ${__classPrivateFieldGet(this, _Framework_frameNumber, "f")}`);
                }
                (_b = __classPrivateFieldGet(this, _Framework_onUpdate, "f")) === null || _b === void 0 ? void 0 : _b.call(this);
                __classPrivateFieldSet(this, _Framework_frameNumber, __classPrivateFieldGet(this, _Framework_frameNumber, "f") >= Number.MAX_SAFE_INTEGER
                    ? 0
                    : __classPrivateFieldGet(this, _Framework_frameNumber, "f") + 1, "f");
            }
        },
        renderFn: (renderFps) => {
            var _b;
            __classPrivateFieldSet(this, _Framework_renderFps, renderFps, "f");
            (_b = __classPrivateFieldGet(this, _Framework_onDraw, "f")) === null || _b === void 0 ? void 0 : _b.call(this);
            // this.#render();
        },
    });
}, _Framework_setupHtmlCanvas = function _Framework_setupHtmlCanvas() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_for_high_resolution_displays
    __classPrivateFieldGet(this, _Framework_htmlCanvasContext, "f").canvas.width =
        __classPrivateFieldGet(this, _Framework_htmlCanvasContext, "f").canvas.getBoundingClientRect().width *
            window.devicePixelRatio;
    __classPrivateFieldGet(this, _Framework_htmlCanvasContext, "f").canvas.height =
        __classPrivateFieldGet(this, _Framework_htmlCanvasContext, "f").canvas.getBoundingClientRect().height *
            window.devicePixelRatio;
    __classPrivateFieldGet(this, _Framework_htmlCanvasContext, "f").imageSmoothingEnabled = false;
    __classPrivateFieldGet(this, _Framework_htmlCanvasContext, "f").fillStyle =
        __classPrivateFieldGet(this, _Framework_htmlCanvasBackground, "f").asRgbCssHex();
    __classPrivateFieldGet(this, _Framework_htmlCanvasContext, "f").fillRect(0, 0, __classPrivateFieldGet(this, _Framework_htmlCanvasContext, "f").canvas.width, __classPrivateFieldGet(this, _Framework_htmlCanvasContext, "f").canvas.height);
}, _Framework_render = function _Framework_render() {
    __classPrivateFieldGet(this, _Framework_canvasPixels, "f").renderTo(__classPrivateFieldGet(this, _Framework_offscreenImageData, "f").data);
    __classPrivateFieldGet(this, _Framework_offscreenContext, "f").putImageData(__classPrivateFieldGet(this, _Framework_offscreenImageData, "f"), 0, 0);
    const htmlCanvasSize = v_(__classPrivateFieldGet(this, _Framework_htmlCanvasContext, "f").canvas.width, __classPrivateFieldGet(this, _Framework_htmlCanvasContext, "f").canvas.height);
    // TODO: encapsulate this calculation and related fields
    __classPrivateFieldSet(this, _Framework_scaleToFill, Math.min(htmlCanvasSize.div(__classPrivateFieldGet(this, _Framework_gameCanvasSize, "f")).floor().x, htmlCanvasSize.div(__classPrivateFieldGet(this, _Framework_gameCanvasSize, "f")).floor().y), "f");
    __classPrivateFieldSet(this, _Framework_centeringOffset, htmlCanvasSize
        .sub(__classPrivateFieldGet(this, _Framework_gameCanvasSize, "f").mul(__classPrivateFieldGet(this, _Framework_scaleToFill, "f")))
        .div(2)
        .floor(), "f");
    // TODO: does the fitting algorithm take DPI into account? Maybe it would allow low res game to occupy more space?
    __classPrivateFieldGet(this, _Framework_instances, "m", _Framework_redrawDebugMargin).call(this);
    __classPrivateFieldGet(this, _Framework_htmlCanvasContext, "f").drawImage(__classPrivateFieldGet(this, _Framework_offscreenContext, "f").canvas, 0, 0, __classPrivateFieldGet(this, _Framework_offscreenContext, "f").canvas.width, __classPrivateFieldGet(this, _Framework_offscreenContext, "f").canvas.height, __classPrivateFieldGet(this, _Framework_centeringOffset, "f").x, __classPrivateFieldGet(this, _Framework_centeringOffset, "f").y, __classPrivateFieldGet(this, _Framework_scaleToFill, "f") * __classPrivateFieldGet(this, _Framework_gameCanvasSize, "f").x, __classPrivateFieldGet(this, _Framework_scaleToFill, "f") * __classPrivateFieldGet(this, _Framework_gameCanvasSize, "f").y);
}, _Framework_redrawDebugMargin = function _Framework_redrawDebugMargin() {
    const debugBgMargin = 1;
    __classPrivateFieldGet(this, _Framework_htmlCanvasContext, "f").fillStyle = DebugMode.enabled
        ? "#ff0000"
        : __classPrivateFieldGet(this, _Framework_htmlCanvasBackground, "f").asRgbCssHex();
    __classPrivateFieldGet(this, _Framework_htmlCanvasContext, "f").fillRect(__classPrivateFieldGet(this, _Framework_centeringOffset, "f").x - debugBgMargin, __classPrivateFieldGet(this, _Framework_centeringOffset, "f").y - debugBgMargin, __classPrivateFieldGet(this, _Framework_scaleToFill, "f") * __classPrivateFieldGet(this, _Framework_gameCanvasSize, "f").x + 2 * debugBgMargin, __classPrivateFieldGet(this, _Framework_scaleToFill, "f") * __classPrivateFieldGet(this, _Framework_gameCanvasSize, "f").y + 2 * debugBgMargin);
};
// TODO: Move debug responsibility to a separate class
_Framework_storageDebugDisabledKey = { value: "framework__debug_disabled" };
_Framework_storageDebugDisabledTrue = { value: "yes" };
