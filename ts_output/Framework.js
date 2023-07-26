"use strict";
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
var _Framework_instances, _Framework_htmlDisplaySelector, _Framework_htmlCanvasSelector, _Framework_htmlControlsFullscreenSelector, _Framework_htmlControlsMuteSelector, _Framework_debugOptions, _Framework_debug, _Framework_gameCanvasSize, _Framework_htmlCanvasBackground, _Framework_htmlCanvasContext, _Framework_offscreenContext, _Framework_offscreenImageData, _Framework_loading, _Framework_gameInput, _Framework_gameLoop, _Framework_fullScreen, _Framework_assets, _Framework_onUpdate, _Framework_onDraw, _Framework_scaleToFill, _Framework_centeringOffset, _Framework_startGame, _Framework_setupHtmlCanvas, _Framework_render, _Framework_redrawDebugMargin;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Framework = void 0;
const Assets_1 = require("./Assets");
const AudioApi_1 = require("./audio/AudioApi");
const Color_1 = require("./Color");
const DrawApi_1 = require("./draw_api/DrawApi");
const FullScreen_1 = require("./FullScreen");
const GameInput_1 = require("./game_input/GameInput");
const GameLoop_1 = require("./game_loop/GameLoop");
const Loading_1 = require("./Loading");
const StorageApi_1 = require("./StorageApi");
const Vector2d_1 = require("./Vector2d");
class Framework {
    get debug() {
        return __classPrivateFieldGet(this, _Framework_debug, "f");
    }
    constructor(options) {
        _Framework_instances.add(this);
        _Framework_htmlDisplaySelector.set(this, "#display");
        _Framework_htmlCanvasSelector.set(this, "#canvas");
        _Framework_htmlControlsFullscreenSelector.set(this, ".controls_fullscreen_toggle");
        _Framework_htmlControlsMuteSelector.set(this, ".controls_mute_toggle");
        _Framework_debugOptions.set(this, void 0);
        _Framework_debug.set(this, void 0);
        _Framework_gameCanvasSize.set(this, void 0);
        _Framework_htmlCanvasBackground.set(this, Color_1.SolidColor.fromRgbCssHex("#000000"));
        _Framework_htmlCanvasContext.set(this, void 0);
        _Framework_offscreenContext.set(this, void 0);
        _Framework_offscreenImageData.set(this, void 0);
        _Framework_loading.set(this, void 0);
        _Framework_gameInput.set(this, void 0);
        _Framework_gameLoop.set(this, void 0);
        _Framework_fullScreen.set(this, void 0);
        _Framework_assets.set(this, void 0);
        _Framework_onUpdate.set(this, void 0);
        _Framework_onDraw.set(this, void 0);
        _Framework_scaleToFill.set(this, 1);
        _Framework_centeringOffset.set(this, Vector2d_1.Vector2d.zero);
        this.frameNumber = 0;
        this.averageFps = 1;
        this.continuousInputEvents = new Set();
        this.fireOnceInputEvents = new Set();
        __classPrivateFieldSet(this, _Framework_debugOptions, options.debug ?? {
            enabledOnInit: false,
        }, "f");
        __classPrivateFieldSet(this, _Framework_debug, __classPrivateFieldGet(this, _Framework_debugOptions, "f")?.enabledOnInit, "f");
        __classPrivateFieldSet(this, _Framework_loading, new Loading_1.Loading(__classPrivateFieldGet(this, _Framework_htmlDisplaySelector, "f")), "f");
        __classPrivateFieldSet(this, _Framework_gameCanvasSize, options.gameCanvasSize.floor(), "f");
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
        offscreenCanvas.width = options.gameCanvasSize.x;
        offscreenCanvas.height = options.gameCanvasSize.y;
        const offscreenContext = offscreenCanvas.getContext("2d", {
            // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#turn_off_transparency
            alpha: false,
        });
        if (!offscreenContext) {
            throw Error("Was unable to obtain OffscreenCanvas' 2D context");
        }
        __classPrivateFieldSet(this, _Framework_offscreenContext, offscreenContext, "f");
        __classPrivateFieldSet(this, _Framework_gameInput, new GameInput_1.GameInput({
            muteButtonsSelector: __classPrivateFieldGet(this, _Framework_htmlControlsMuteSelector, "f"),
            fullScreenButtonsSelector: __classPrivateFieldGet(this, _Framework_htmlControlsFullscreenSelector, "f"),
            debugToggleKey: __classPrivateFieldGet(this, _Framework_debugOptions, "f")?.toggleKey,
        }), "f");
        __classPrivateFieldSet(this, _Framework_gameLoop, new GameLoop_1.GameLoop({
            desiredFps: options.desiredFps,
            logActualFps: options.logActualFps ?? false,
            requestAnimationFrameFn: window.requestAnimationFrame.bind(window),
        }), "f");
        const audioContext = new AudioContext();
        __classPrivateFieldSet(this, _Framework_assets, new Assets_1.Assets({
            decodeAudioData: (arrayBuffer) => audioContext.decodeAudioData(arrayBuffer),
        }), "f");
        this.audioApi = new AudioApi_1.AudioApi(__classPrivateFieldGet(this, _Framework_assets, "f"), audioContext);
        __classPrivateFieldSet(this, _Framework_fullScreen, FullScreen_1.FullScreen.newFor(__classPrivateFieldGet(this, _Framework_htmlDisplaySelector, "f"), __classPrivateFieldGet(this, _Framework_htmlControlsFullscreenSelector, "f")), "f");
        __classPrivateFieldSet(this, _Framework_offscreenImageData, __classPrivateFieldGet(this, _Framework_offscreenContext, "f").createImageData(__classPrivateFieldGet(this, _Framework_offscreenContext, "f").canvas.width, __classPrivateFieldGet(this, _Framework_offscreenContext, "f").canvas.height), "f");
        this.drawApi = new DrawApi_1.DrawApi({
            canvasBytes: __classPrivateFieldGet(this, _Framework_offscreenImageData, "f").data,
            canvasSize: __classPrivateFieldGet(this, _Framework_gameCanvasSize, "f"),
            assets: __classPrivateFieldGet(this, _Framework_assets, "f"),
        });
        this.storageApi = new StorageApi_1.StorageApi();
    }
    loadAssets(assetsToLoad) {
        return __classPrivateFieldGet(this, _Framework_assets, "f").loadAssets(assetsToLoad).then(() => ({
            startGame: __classPrivateFieldGet(this, _Framework_instances, "m", _Framework_startGame).bind(this),
        }));
    }
    setOnUpdate(onUpdate) {
        __classPrivateFieldSet(this, _Framework_onUpdate, onUpdate, "f");
    }
    setOnDraw(onDraw) {
        __classPrivateFieldSet(this, _Framework_onDraw, onDraw, "f");
    }
}
exports.Framework = Framework;
_Framework_htmlDisplaySelector = new WeakMap(), _Framework_htmlCanvasSelector = new WeakMap(), _Framework_htmlControlsFullscreenSelector = new WeakMap(), _Framework_htmlControlsMuteSelector = new WeakMap(), _Framework_debugOptions = new WeakMap(), _Framework_debug = new WeakMap(), _Framework_gameCanvasSize = new WeakMap(), _Framework_htmlCanvasBackground = new WeakMap(), _Framework_htmlCanvasContext = new WeakMap(), _Framework_offscreenContext = new WeakMap(), _Framework_offscreenImageData = new WeakMap(), _Framework_loading = new WeakMap(), _Framework_gameInput = new WeakMap(), _Framework_gameLoop = new WeakMap(), _Framework_fullScreen = new WeakMap(), _Framework_assets = new WeakMap(), _Framework_onUpdate = new WeakMap(), _Framework_onDraw = new WeakMap(), _Framework_scaleToFill = new WeakMap(), _Framework_centeringOffset = new WeakMap(), _Framework_instances = new WeakSet(), _Framework_startGame = function _Framework_startGame(onStart) {
    __classPrivateFieldGet(this, _Framework_instances, "m", _Framework_setupHtmlCanvas).call(this);
    window.addEventListener("resize", (_event) => {
        __classPrivateFieldGet(this, _Framework_instances, "m", _Framework_setupHtmlCanvas).call(this);
    });
    // TODO: rename to make it clear this will happen before the game loop starts and game gets rendered
    onStart?.();
    __classPrivateFieldGet(this, _Framework_loading, "f").showApp();
    __classPrivateFieldGet(this, _Framework_gameInput, "f").startListening();
    __classPrivateFieldGet(this, _Framework_gameLoop, "f").start({
        updateFn: (frameNumber, averageFps) => {
            const fireOnceEvents = __classPrivateFieldGet(this, _Framework_gameInput, "f").consumeFireOnceEvents();
            if (fireOnceEvents.has("full_screen")) {
                __classPrivateFieldGet(this, _Framework_fullScreen, "f").toggle();
            }
            if (fireOnceEvents.has("mute_unmute_toggle")) {
                this.audioApi.toggleMuteUnmute();
            }
            if (fireOnceEvents.has("debug_toggle")) {
                __classPrivateFieldSet(this, _Framework_debug, !__classPrivateFieldGet(this, _Framework_debug, "f"), "f");
                __classPrivateFieldGet(this, _Framework_instances, "m", _Framework_redrawDebugMargin).call(this);
            }
            const continuousEvents = __classPrivateFieldGet(this, _Framework_gameInput, "f").getCurrentContinuousEvents();
            if (fireOnceEvents.size > 0 || continuousEvents.size > 0) {
                this.audioApi.resumeAudioContextIfNeeded();
            }
            this.frameNumber = frameNumber;
            this.averageFps = averageFps;
            this.continuousInputEvents = continuousEvents;
            this.fireOnceInputEvents = fireOnceEvents;
            __classPrivateFieldGet(this, _Framework_onUpdate, "f")?.call(this);
        },
        renderFn: () => {
            __classPrivateFieldGet(this, _Framework_onDraw, "f")?.call(this);
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
    const htmlCanvasSize = (0, Vector2d_1.v_)(__classPrivateFieldGet(this, _Framework_htmlCanvasContext, "f").canvas.width, __classPrivateFieldGet(this, _Framework_htmlCanvasContext, "f").canvas.height);
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
