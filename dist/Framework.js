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
var _Framework_instances, _a, _Framework_storageDebugDisabledKey, _Framework_storageDebugDisabledTrue, _Framework_htmlDisplaySelector, _Framework_htmlCanvasSelector, _Framework_htmlControlsFullscreenSelector, _Framework_htmlControlsMuteSelector, _Framework_debugOptions, _Framework_debug, _Framework_frameByFrame, _Framework_gameCanvasSize, _Framework_htmlCanvasBackground, _Framework_htmlCanvasContext, _Framework_offscreenContext, _Framework_offscreenImageData, _Framework_loading, _Framework_gameLoop, _Framework_fullScreen, _Framework_onStarted, _Framework_onUpdate, _Framework_onDraw, _Framework_scaleToFill, _Framework_centeringOffset, _Framework_frameNumber, _Framework_startGame, _Framework_setupHtmlCanvas, _Framework_render, _Framework_redrawDebugMargin;
import { Assets } from "./Assets";
import { AudioApi } from "./audio/AudioApi";
import { SolidColor } from "./Color";
import { DrawApi } from "./draw_api/DrawApi";
import { FullScreen } from "./FullScreen";
import { GameInput } from "./game_input/GameInput";
import { GameLoop } from "./game_loop/GameLoop";
import { Loading } from "./Loading";
import { StorageApi } from "./storage/StorageApi";
import { Utils } from "./Utils";
import { v_, Vector2d } from "./Vector2d";
export class Framework {
    get debug() {
        return __classPrivateFieldGet(this, _Framework_debug, "f");
    }
    get frameNumber() {
        return __classPrivateFieldGet(this, _Framework_frameNumber, "f");
    }
    constructor(options) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        _Framework_instances.add(this);
        _Framework_htmlDisplaySelector.set(this, "#display");
        _Framework_htmlCanvasSelector.set(this, "#canvas");
        _Framework_htmlControlsFullscreenSelector.set(this, ".controls_fullscreen_toggle");
        _Framework_htmlControlsMuteSelector.set(this, ".controls_mute_toggle");
        _Framework_debugOptions.set(this, void 0);
        _Framework_debug.set(this, void 0);
        _Framework_frameByFrame.set(this, void 0);
        _Framework_gameCanvasSize.set(this, void 0);
        _Framework_htmlCanvasBackground.set(this, SolidColor.fromRgbCssHex("#000000"));
        _Framework_htmlCanvasContext.set(this, void 0);
        _Framework_offscreenContext.set(this, void 0);
        _Framework_offscreenImageData.set(this, void 0);
        _Framework_loading.set(this, void 0);
        _Framework_gameLoop.set(this, void 0);
        _Framework_fullScreen.set(this, void 0);
        _Framework_onStarted.set(this, void 0);
        _Framework_onUpdate.set(this, void 0);
        _Framework_onDraw.set(this, void 0);
        _Framework_scaleToFill.set(this, 1);
        _Framework_centeringOffset.set(this, Vector2d.zero);
        _Framework_frameNumber.set(this, 0);
        this.averageFps = 1;
        __classPrivateFieldSet(this, _Framework_debugOptions, (_b = options.debug) !== null && _b !== void 0 ? _b : {
            available: false,
        }, "f");
        __classPrivateFieldSet(this, _Framework_debug, ((_c = __classPrivateFieldGet(this, _Framework_debugOptions, "f")) === null || _c === void 0 ? void 0 : _c.available)
            ? window.localStorage.getItem(__classPrivateFieldGet(Framework, _a, "f", _Framework_storageDebugDisabledKey)) !==
                __classPrivateFieldGet(Framework, _a, "f", _Framework_storageDebugDisabledTrue)
            : false, "f");
        __classPrivateFieldSet(this, _Framework_frameByFrame, false, "f");
        __classPrivateFieldSet(this, _Framework_loading, new Loading(__classPrivateFieldGet(this, _Framework_htmlDisplaySelector, "f")), "f");
        __classPrivateFieldSet(this, _Framework_gameCanvasSize, options.gameCanvasSize === "64x64"
            ? v_(64, 64)
            : options.gameCanvasSize === "128x128"
                ? v_(128, 128)
                : Utils.throwError(`Unsupported canvas size: "${options.gameCanvasSize}"`), "f");
        const htmlCanvas = document.querySelector(__classPrivateFieldGet(this, _Framework_htmlCanvasSelector, "f"));
        if (!htmlCanvas) {
            throw Error(`Was unable to find <canvas> by selector '${__classPrivateFieldGet(this, _Framework_htmlCanvasSelector, "f")}'`);
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
            muteButtonsSelector: __classPrivateFieldGet(this, _Framework_htmlControlsMuteSelector, "f"),
            fullScreenButtonsSelector: __classPrivateFieldGet(this, _Framework_htmlControlsFullscreenSelector, "f"),
            // TODO: extract ";", ",", and "." to some file about debugging
            debugToggleKey: ((_d = __classPrivateFieldGet(this, _Framework_debugOptions, "f")) === null || _d === void 0 ? void 0 : _d.available)
                ? (_f = (_e = __classPrivateFieldGet(this, _Framework_debugOptions, "f")) === null || _e === void 0 ? void 0 : _e.toggleKey) !== null && _f !== void 0 ? _f : ";"
                : undefined,
            debugFrameByFrameActivateKey: ((_g = __classPrivateFieldGet(this, _Framework_debugOptions, "f")) === null || _g === void 0 ? void 0 : _g.available)
                ? (_j = (_h = __classPrivateFieldGet(this, _Framework_debugOptions, "f").frameByFrame) === null || _h === void 0 ? void 0 : _h.activateKey) !== null && _j !== void 0 ? _j : ","
                : undefined,
            debugFrameByFrameStepKey: ((_k = __classPrivateFieldGet(this, _Framework_debugOptions, "f")) === null || _k === void 0 ? void 0 : _k.available)
                ? (_m = (_l = __classPrivateFieldGet(this, _Framework_debugOptions, "f").frameByFrame) === null || _l === void 0 ? void 0 : _l.stepKey) !== null && _m !== void 0 ? _m : "."
                : undefined,
        });
        __classPrivateFieldSet(this, _Framework_gameLoop, new GameLoop({
            desiredFps: options.desiredFps,
            logActualFps: (_o = options.logActualFps) !== null && _o !== void 0 ? _o : false,
            requestAnimationFrameFn: window.requestAnimationFrame.bind(window),
        }), "f");
        this.storageApi = new StorageApi();
        const audioContext = new AudioContext();
        this.assets = new Assets({
            decodeAudioData: (arrayBuffer) => audioContext.decodeAudioData(arrayBuffer),
        });
        this.audioApi = new AudioApi(this.assets, audioContext);
        __classPrivateFieldSet(this, _Framework_fullScreen, FullScreen.newFor(__classPrivateFieldGet(this, _Framework_htmlDisplaySelector, "f"), __classPrivateFieldGet(this, _Framework_htmlControlsFullscreenSelector, "f")), "f");
        __classPrivateFieldSet(this, _Framework_offscreenImageData, __classPrivateFieldGet(this, _Framework_offscreenContext, "f").createImageData(__classPrivateFieldGet(this, _Framework_offscreenContext, "f").canvas.width, __classPrivateFieldGet(this, _Framework_offscreenContext, "f").canvas.height), "f");
        this.drawApi = new DrawApi({
            canvasBytes: __classPrivateFieldGet(this, _Framework_offscreenImageData, "f").data,
            canvasSize: __classPrivateFieldGet(this, _Framework_gameCanvasSize, "f"),
            assets: this.assets,
        });
    }
    loadAssets(assetsToLoad) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.assets.loadAssets(assetsToLoad).then(() => ({
                startGame: __classPrivateFieldGet(this, _Framework_instances, "m", _Framework_startGame).bind(this),
            }));
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
        (_b = __classPrivateFieldGet(this, _Framework_onStarted, "f")) === null || _b === void 0 ? void 0 : _b.call(this);
    }
}
_a = Framework, _Framework_htmlDisplaySelector = new WeakMap(), _Framework_htmlCanvasSelector = new WeakMap(), _Framework_htmlControlsFullscreenSelector = new WeakMap(), _Framework_htmlControlsMuteSelector = new WeakMap(), _Framework_debugOptions = new WeakMap(), _Framework_debug = new WeakMap(), _Framework_frameByFrame = new WeakMap(), _Framework_gameCanvasSize = new WeakMap(), _Framework_htmlCanvasBackground = new WeakMap(), _Framework_htmlCanvasContext = new WeakMap(), _Framework_offscreenContext = new WeakMap(), _Framework_offscreenImageData = new WeakMap(), _Framework_loading = new WeakMap(), _Framework_gameLoop = new WeakMap(), _Framework_fullScreen = new WeakMap(), _Framework_onStarted = new WeakMap(), _Framework_onUpdate = new WeakMap(), _Framework_onDraw = new WeakMap(), _Framework_scaleToFill = new WeakMap(), _Framework_centeringOffset = new WeakMap(), _Framework_frameNumber = new WeakMap(), _Framework_instances = new WeakSet(), _Framework_startGame = function _Framework_startGame() {
    var _b;
    if (__BEETPX_IS_PROD__) {
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
    (_b = __classPrivateFieldGet(this, _Framework_onStarted, "f")) === null || _b === void 0 ? void 0 : _b.call(this);
    __classPrivateFieldGet(this, _Framework_loading, "f").showApp();
    this.gameInput.startListening();
    __classPrivateFieldGet(this, _Framework_gameLoop, "f").start({
        updateFn: (averageFps) => {
            var _b;
            if (this.gameInput.buttonFullScreen.wasJustPressed(false)) {
                __classPrivateFieldGet(this, _Framework_fullScreen, "f").toggle();
            }
            if (this.gameInput.buttonMuteUnmute.wasJustPressed(false)) {
                this.audioApi.toggleMuteUnmute();
            }
            if (this.gameInput.buttonDebugToggle.wasJustPressed(false)) {
                __classPrivateFieldSet(this, _Framework_debug, !__classPrivateFieldGet(this, _Framework_debug, "f"), "f");
                console.debug(`Debug flag set to: ${__classPrivateFieldGet(this, _Framework_debug, "f")}`);
                if (__classPrivateFieldGet(this, _Framework_debug, "f")) {
                    window.localStorage.removeItem(__classPrivateFieldGet(Framework, _a, "f", _Framework_storageDebugDisabledKey));
                }
                else {
                    window.localStorage.setItem(__classPrivateFieldGet(Framework, _a, "f", _Framework_storageDebugDisabledKey), __classPrivateFieldGet(Framework, _a, "f", _Framework_storageDebugDisabledTrue));
                }
                __classPrivateFieldGet(this, _Framework_instances, "m", _Framework_redrawDebugMargin).call(this);
            }
            if (this.gameInput.buttonFrameByFrameToggle.wasJustPressed(false)) {
                __classPrivateFieldSet(this, _Framework_frameByFrame, !__classPrivateFieldGet(this, _Framework_frameByFrame, "f"), "f");
                console.debug(`FrameByFrame mode set to: ${__classPrivateFieldGet(this, _Framework_frameByFrame, "f")}`);
            }
            if (this.gameInput.wasAnyButtonPressed()) {
                this.audioApi.resumeAudioContextIfNeeded();
            }
            this.averageFps = averageFps;
            const shouldUpdate = !__classPrivateFieldGet(this, _Framework_frameByFrame, "f") ||
                this.gameInput.buttonFrameByFrameStep.wasJustPressed(false);
            this.gameInput.update({ skipGameButtons: !shouldUpdate });
            if (shouldUpdate) {
                if (__classPrivateFieldGet(this, _Framework_frameByFrame, "f")) {
                    console.debug(`Running onUpdate for frame: ${__classPrivateFieldGet(this, _Framework_frameNumber, "f")}`);
                }
                (_b = __classPrivateFieldGet(this, _Framework_onUpdate, "f")) === null || _b === void 0 ? void 0 : _b.call(this);
                __classPrivateFieldSet(this, _Framework_frameNumber, __classPrivateFieldGet(this, _Framework_frameNumber, "f") == Number.MAX_SAFE_INTEGER
                    ? 0
                    : __classPrivateFieldGet(this, _Framework_frameNumber, "f") + 1, "f");
            }
        },
        renderFn: () => {
            var _b;
            (_b = __classPrivateFieldGet(this, _Framework_onDraw, "f")) === null || _b === void 0 ? void 0 : _b.call(this);
            __classPrivateFieldGet(this, _Framework_instances, "m", _Framework_render).call(this);
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
    __classPrivateFieldGet(this, _Framework_offscreenContext, "f").putImageData(__classPrivateFieldGet(this, _Framework_offscreenImageData, "f"), 0, 0);
    const htmlCanvasSize = v_(__classPrivateFieldGet(this, _Framework_htmlCanvasContext, "f").canvas.width, __classPrivateFieldGet(this, _Framework_htmlCanvasContext, "f").canvas.height);
    // TODO: encapsulate this calculation and related fields
    __classPrivateFieldSet(this, _Framework_scaleToFill, Math.min(htmlCanvasSize.div(__classPrivateFieldGet(this, _Framework_gameCanvasSize, "f")).floor().x, htmlCanvasSize.div(__classPrivateFieldGet(this, _Framework_gameCanvasSize, "f")).floor().y), "f");
    __classPrivateFieldSet(this, _Framework_centeringOffset, htmlCanvasSize
        .sub(__classPrivateFieldGet(this, _Framework_gameCanvasSize, "f").mul(__classPrivateFieldGet(this, _Framework_scaleToFill, "f")))
        .div(2)
        .floor(), "f");
    __classPrivateFieldGet(this, _Framework_instances, "m", _Framework_redrawDebugMargin).call(this);
    __classPrivateFieldGet(this, _Framework_htmlCanvasContext, "f").drawImage(__classPrivateFieldGet(this, _Framework_offscreenContext, "f").canvas, 0, 0, __classPrivateFieldGet(this, _Framework_offscreenContext, "f").canvas.width, __classPrivateFieldGet(this, _Framework_offscreenContext, "f").canvas.height, __classPrivateFieldGet(this, _Framework_centeringOffset, "f").x, __classPrivateFieldGet(this, _Framework_centeringOffset, "f").y, __classPrivateFieldGet(this, _Framework_scaleToFill, "f") * __classPrivateFieldGet(this, _Framework_gameCanvasSize, "f").x, __classPrivateFieldGet(this, _Framework_scaleToFill, "f") * __classPrivateFieldGet(this, _Framework_gameCanvasSize, "f").y);
}, _Framework_redrawDebugMargin = function _Framework_redrawDebugMargin() {
    const debugBgMargin = 1;
    __classPrivateFieldGet(this, _Framework_htmlCanvasContext, "f").fillStyle = __classPrivateFieldGet(this, _Framework_debug, "f")
        ? "#ff0000"
        : __classPrivateFieldGet(this, _Framework_htmlCanvasBackground, "f").asRgbCssHex();
    __classPrivateFieldGet(this, _Framework_htmlCanvasContext, "f").fillRect(__classPrivateFieldGet(this, _Framework_centeringOffset, "f").x - debugBgMargin, __classPrivateFieldGet(this, _Framework_centeringOffset, "f").y - debugBgMargin, __classPrivateFieldGet(this, _Framework_scaleToFill, "f") * __classPrivateFieldGet(this, _Framework_gameCanvasSize, "f").x + 2 * debugBgMargin, __classPrivateFieldGet(this, _Framework_scaleToFill, "f") * __classPrivateFieldGet(this, _Framework_gameCanvasSize, "f").y + 2 * debugBgMargin);
};
// TODO: Move debug responsibility to a separate class
_Framework_storageDebugDisabledKey = { value: "framework__debug_disabled" };
_Framework_storageDebugDisabledTrue = { value: "yes" };
