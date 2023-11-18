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
var _Framework_instances, _a, _Framework_storageDebugDisabledKey, _Framework_storageDebugDisabledTrue, _Framework_frameByFrame, _Framework_browserType, _Framework_gameCanvasSize, _Framework_htmlCanvasBackground, _Framework_loading, _Framework_gameLoop, _Framework_assetLoader, _Framework_canvas, _Framework_isStarted, _Framework_onStarted, _Framework_onUpdate, _Framework_onDraw, _Framework_frameNumber, _Framework_renderFps, _Framework_alreadyResumedAudioContext, _Framework_startGame;
import { BeetPx } from "./BeetPx";
import { HtmlTemplate } from "./HtmlTemplate";
import { BpxUtils, u_ } from "./Utils";
import { AssetLoader } from "./assets/AssetLoader";
import { Assets } from "./assets/Assets";
import { AudioApi } from "./audio/AudioApi";
import { BrowserTypeDetector, } from "./browser/BrowserTypeDetector";
import { CanvasForProduction } from "./canvas/CanvasForProduction";
import { BpxRgbColor, black_ } from "./color/RgbColor";
import { DebugMode } from "./debug/DebugMode";
import { DrawApi } from "./draw_api/DrawApi";
import { BpxFontSaint11Minimal4 } from "./font/BpxFontSaint11Minimal4";
import { BpxFontSaint11Minimal5 } from "./font/BpxFontSaint11Minimal5";
import { GameInput } from "./game_input/GameInput";
import { Button } from "./game_input/buttons/Button";
import { GameLoop } from "./game_loop/GameLoop";
import { Logger } from "./logger/Logger";
import { FullScreen } from "./misc/FullScreen";
import { Loading } from "./misc/Loading";
import { v_ } from "./misc/Vector2d";
import { StorageApi } from "./storage/StorageApi";
export class Framework {
    get frameNumber() {
        return __classPrivateFieldGet(this, _Framework_frameNumber, "f");
    }
    get renderFps() {
        return __classPrivateFieldGet(this, _Framework_renderFps, "f");
    }
    constructor(options) {
        var _b;
        _Framework_instances.add(this);
        _Framework_frameByFrame.set(this, void 0);
        _Framework_browserType.set(this, void 0);
        _Framework_gameCanvasSize.set(this, void 0);
        _Framework_htmlCanvasBackground.set(this, BpxRgbColor.fromCssHex("#000000"));
        _Framework_loading.set(this, void 0);
        _Framework_gameLoop.set(this, void 0);
        _Framework_assetLoader.set(this, void 0);
        _Framework_canvas.set(this, void 0);
        _Framework_isStarted.set(this, false);
        _Framework_onStarted.set(this, void 0);
        _Framework_onUpdate.set(this, void 0);
        _Framework_onDraw.set(this, void 0);
        _Framework_frameNumber.set(this, 0);
        _Framework_renderFps.set(this, 1);
        
        _Framework_alreadyResumedAudioContext.set(this, false);
        DebugMode.enabled = options.debugFeatures
            ? window.localStorage.getItem(__classPrivateFieldGet(Framework, _a, "f", _Framework_storageDebugDisabledKey)) !==
                __classPrivateFieldGet(Framework, _a, "f", _Framework_storageDebugDisabledTrue)
            : false;
        Logger.debugBeetPx("Framework options:", options);
        if (options.desiredUpdateFps !== 30 && options.desiredUpdateFps !== 60) {
            BpxUtils.throwError(`Unsupported desiredUpdateFps: ${options.desiredUpdateFps}`);
        }
        Button.setRepeatingParamsFor(options.desiredUpdateFps);
        __classPrivateFieldSet(this, _Framework_frameByFrame, false, "f");
        __classPrivateFieldSet(this, _Framework_browserType, BrowserTypeDetector.detect(navigator.userAgent), "f");
        __classPrivateFieldSet(this, _Framework_gameCanvasSize, options.gameCanvasSize === "64x64"
            ? v_(64, 64)
            : options.gameCanvasSize === "128x128"
                ? v_(128, 128)
                : options.gameCanvasSize === "256x256"
                    ? v_(256, 256)
                    : BpxUtils.throwError(`Unsupported canvas size: "${options.gameCanvasSize}"`), "f");
        this.gameInput = new GameInput({
            enableDebugInputs: options.debugFeatures,
            browserType: __classPrivateFieldGet(this, _Framework_browserType, "f"),
        });
        __classPrivateFieldSet(this, _Framework_gameLoop, new GameLoop({
            desiredUpdateFps: options.desiredUpdateFps,
            rafFn: window.requestAnimationFrame.bind(window),
            documentVisibilityStateProvider: document,
        }), "f");
        this.storageApi = new StorageApi();
        const audioContext = new AudioContext();
        this.assets = new Assets();
        __classPrivateFieldSet(this, _Framework_assetLoader, new AssetLoader(this.assets, {
            decodeAudioData: (arrayBuffer) => audioContext.decodeAudioData(arrayBuffer),
        }), "f");
        this.audioApi = new AudioApi(this.assets, audioContext);
        __classPrivateFieldSet(this, _Framework_loading, new Loading({
            onStartClicked: () => {
                this.audioApi
                    .tryToResumeAudioContextSuspendedByBrowserForSecurityReasons()
                    .then((resumed) => {
                    if (resumed) {
                        __classPrivateFieldSet(this, _Framework_alreadyResumedAudioContext, true, "f");
                    }
                });
            },
        }), "f");
        this.fullScreen = FullScreen.create();
        const htmlCanvas = (_b = document.querySelector(HtmlTemplate.selectors.canvas)) !== null && _b !== void 0 ? _b : u_.throwError(`Was unable to find <canvas> by selector '${HtmlTemplate.selectors.canvas}'`);
        __classPrivateFieldSet(this, _Framework_canvas, new CanvasForProduction(__classPrivateFieldGet(this, _Framework_gameCanvasSize, "f"), htmlCanvas, __classPrivateFieldGet(this, _Framework_htmlCanvasBackground, "f")), "f");
        this.drawApi = new DrawApi({
            canvas: __classPrivateFieldGet(this, _Framework_canvas, "f"),
            assets: this.assets,
        });
    }
    detectedBrowserType() {
        return __classPrivateFieldGet(this, _Framework_browserType, "f");
    }
    init(assetsToLoad) {
        return __awaiter(this, void 0, void 0, function* () {
            assetsToLoad.fonts.push({
                font: new BpxFontSaint11Minimal4(),
                spriteTextColor: null,
            });
            assetsToLoad.fonts.push({
                font: new BpxFontSaint11Minimal5(),
                spriteTextColor: null,
            });
            yield __classPrivateFieldGet(this, _Framework_assetLoader, "f").loadAssets(assetsToLoad);
            Logger.infoBeetPx(`BeetPx ${BEETPX__VERSION} initialized`);
            return {
                startGame: __classPrivateFieldGet(this, _Framework_instances, "m", _Framework_startGame).bind(this),
            };
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
_a = Framework, _Framework_frameByFrame = new WeakMap(), _Framework_browserType = new WeakMap(), _Framework_gameCanvasSize = new WeakMap(), _Framework_htmlCanvasBackground = new WeakMap(), _Framework_loading = new WeakMap(), _Framework_gameLoop = new WeakMap(), _Framework_assetLoader = new WeakMap(), _Framework_canvas = new WeakMap(), _Framework_isStarted = new WeakMap(), _Framework_onStarted = new WeakMap(), _Framework_onUpdate = new WeakMap(), _Framework_onDraw = new WeakMap(), _Framework_frameNumber = new WeakMap(), _Framework_renderFps = new WeakMap(), _Framework_alreadyResumedAudioContext = new WeakMap(), _Framework_instances = new WeakSet(), _Framework_startGame = function _Framework_startGame() {
    var _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (__classPrivateFieldGet(this, _Framework_isStarted, "f")) {
            throw Error("Tried to start a game, but it is already started");
        }
        __classPrivateFieldSet(this, _Framework_isStarted, true, "f");
        if (BEETPX__IS_PROD) {
            
            
            
            
            
            
            
            window.addEventListener("beforeunload", (event) => {
                event.preventDefault();
                event.returnValue = "";
                return "";
            });
        }
        __classPrivateFieldSet(this, _Framework_frameNumber, 0, "f");
        yield __classPrivateFieldGet(this, _Framework_loading, "f").showStartScreen();
        (_b = __classPrivateFieldGet(this, _Framework_onStarted, "f")) === null || _b === void 0 ? void 0 : _b.call(this);
        this.gameInput.startListening();
        __classPrivateFieldGet(this, _Framework_gameLoop, "f").start({
            updateFn: () => {
                var _b;
                if (this.gameInput.buttonFullScreen.wasJustPressed(false)) {
                    this.fullScreen.toggleFullScreen();
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
                __classPrivateFieldGet(this, _Framework_canvas, "f").render();
            },
        });
    });
};
_Framework_storageDebugDisabledKey = { value: "framework__debug_disabled" };
_Framework_storageDebugDisabledTrue = { value: "yes" };
