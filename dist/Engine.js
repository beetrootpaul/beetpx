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
var _Engine_instances, _a, _Engine_storageDebugDisabledKey, _Engine_storageDebugDisabledTrue, _Engine_assetsToLoad, _Engine_browserType, _Engine_gameCanvasSize, _Engine_htmlCanvasBackground, _Engine_loading, _Engine_gameLoop, _Engine_assetLoader, _Engine_canvas, _Engine_isStarted, _Engine_onStarted, _Engine_onUpdate, _Engine_onDraw, _Engine_currentFrameNumber, _Engine_renderingFps, _Engine_alreadyResumedAudioContext, _Engine_startGame;
import { AssetLoader } from "./assets/AssetLoader";
import { Assets } from "./assets/Assets";
import { AudioApi } from "./audio/AudioApi";
import { BeetPx } from "./BeetPx";
import { BrowserTypeDetector, } from "./browser/BrowserTypeDetector";
import { CanvasForProduction } from "./canvas/CanvasForProduction";
import { rgb_p8_ } from "./color/BpxPalettePico8";
import { BpxRgbColor, rgb_black_ } from "./color/RgbColor";
import { DebugMode } from "./debug/DebugMode";
import { DrawApi } from "./draw_api/DrawApi";
import { BpxFontPico8 } from "./font/BpxFontPico8";
import { BpxFontSaint11Minimal4 } from "./font/BpxFontSaint11Minimal4";
import { BpxFontSaint11Minimal5 } from "./font/BpxFontSaint11Minimal5";
import { Button } from "./game_input/buttons/Button";
import { GameInput } from "./game_input/GameInput";
import { GameLoop } from "./game_loop/GameLoop";
import { HtmlTemplate } from "./HtmlTemplate";
import { Logger } from "./logger/Logger";
import { FullScreen } from "./misc/FullScreen";
import { Loading } from "./misc/Loading";
import { v_ } from "./misc/Vector2d";
import { StorageApi } from "./storage/StorageApi";
import { BpxUtils, u_ } from "./Utils";
export class Engine {
    get frameNumber() {
        return __classPrivateFieldGet(this, _Engine_currentFrameNumber, "f");
    }
    get renderingFps() {
        return __classPrivateFieldGet(this, _Engine_renderingFps, "f");
    }
    get detectedBrowserType() {
        return __classPrivateFieldGet(this, _Engine_browserType, "f");
    }
    constructor(engineInitParams = {}) {
        var _b;
        _Engine_instances.add(this);
        _Engine_assetsToLoad.set(this, void 0);
        _Engine_browserType.set(this, void 0);
        _Engine_gameCanvasSize.set(this, void 0);
        _Engine_htmlCanvasBackground.set(this, BpxRgbColor.fromCssHex("#000000"));
        _Engine_loading.set(this, void 0);
        _Engine_gameLoop.set(this, void 0);
        _Engine_assetLoader.set(this, void 0);
        _Engine_canvas.set(this, void 0);
        _Engine_isStarted.set(this, false);
        _Engine_onStarted.set(this, void 0);
        _Engine_onUpdate.set(this, void 0);
        _Engine_onDraw.set(this, void 0);
        _Engine_currentFrameNumber.set(this, 0);
        _Engine_renderingFps.set(this, 1);
        
        _Engine_alreadyResumedAudioContext.set(this, false);
        engineInitParams.gameCanvasSize ?? (engineInitParams.gameCanvasSize = "128x128");
        engineInitParams.fixedTimestep ?? (engineInitParams.fixedTimestep = "60fps");
        engineInitParams.debugMode ?? (engineInitParams.debugMode = false);
        engineInitParams.assets ?? (engineInitParams.assets = {});
        window.addEventListener("error", (event) => {
            HtmlTemplate.showError(event.message);
            
            
            this.audioApi
                ?.getAudioContext()
                .suspend()
                .then(() => { });
            
            return true;
        });
        window.addEventListener("unhandledrejection", (event) => {
            HtmlTemplate.showError(event.reason);
            
            
            this.audioApi
                ?.getAudioContext()
                .suspend()
                .then(() => { });
        });
        DebugMode.enabled = engineInitParams.debugMode
            ? window.localStorage.getItem(__classPrivateFieldGet(_a, _a, "f", _Engine_storageDebugDisabledKey)) !==
                __classPrivateFieldGet(_a, _a, "f", _Engine_storageDebugDisabledTrue)
            : false;
        Logger.debugBeetPx("Engine init params:", engineInitParams);
        __classPrivateFieldSet(this, _Engine_assetsToLoad, engineInitParams.assets, "f");
        (_b = __classPrivateFieldGet(this, _Engine_assetsToLoad, "f")).fonts ?? (_b.fonts = []);
        __classPrivateFieldGet(this, _Engine_assetsToLoad, "f").fonts.push({
            font: new BpxFontPico8(),
            spriteTextColor: rgb_p8_.white,
        });
        __classPrivateFieldGet(this, _Engine_assetsToLoad, "f").fonts.push({
            font: new BpxFontSaint11Minimal4(),
            spriteTextColor: null,
        });
        __classPrivateFieldGet(this, _Engine_assetsToLoad, "f").fonts.push({
            font: new BpxFontSaint11Minimal5(),
            spriteTextColor: null,
        });
        const fixedTimestepFps = engineInitParams.fixedTimestep === "60fps"
            ? 60
            : engineInitParams.fixedTimestep === "30fps"
                ? 30
                : BpxUtils.throwError(`Unsupported fixedTimestep: "${engineInitParams.fixedTimestep}"`);
        Button.setRepeatingParamsFor(fixedTimestepFps);
        __classPrivateFieldSet(this, _Engine_browserType, BrowserTypeDetector.detect(navigator.userAgent), "f");
        __classPrivateFieldSet(this, _Engine_gameCanvasSize, engineInitParams.gameCanvasSize === "64x64"
            ? v_(64, 64)
            : engineInitParams.gameCanvasSize === "128x128"
                ? v_(128, 128)
                : engineInitParams.gameCanvasSize === "256x256"
                    ? v_(256, 256)
                    : BpxUtils.throwError(`Unsupported gameCanvasSize: "${engineInitParams.gameCanvasSize}"`), "f");
        this.gameInput = new GameInput({
            enableDebugInputs: engineInitParams.debugMode,
            browserType: __classPrivateFieldGet(this, _Engine_browserType, "f"),
        });
        __classPrivateFieldSet(this, _Engine_gameLoop, new GameLoop({
            fixedTimestepFps: fixedTimestepFps,
            rafFn: window.requestAnimationFrame.bind(window),
            documentVisibilityStateProvider: document,
        }), "f");
        this.storageApi = new StorageApi();
        const audioContext = new AudioContext();
        this.assets = new Assets();
        __classPrivateFieldSet(this, _Engine_assetLoader, new AssetLoader(this.assets, {
            decodeAudioData: (arrayBuffer) => audioContext.decodeAudioData(arrayBuffer),
        }), "f");
        this.audioApi = new AudioApi(this.assets, audioContext);
        __classPrivateFieldSet(this, _Engine_loading, new Loading({
            onStartClicked: () => {
                this.audioApi
                    .tryToResumeAudioContextSuspendedByBrowserForSecurityReasons()
                    .then((resumed) => {
                    if (resumed) {
                        __classPrivateFieldSet(this, _Engine_alreadyResumedAudioContext, true, "f");
                    }
                });
            },
        }), "f");
        this.fullScreen = FullScreen.create();
        const htmlCanvas = document.querySelector(HtmlTemplate.selectors.canvas) ??
            u_.throwError(`Was unable to find <canvas> by selector '${HtmlTemplate.selectors.canvas}'`);
        __classPrivateFieldSet(this, _Engine_canvas, new CanvasForProduction(__classPrivateFieldGet(this, _Engine_gameCanvasSize, "f"), htmlCanvas, __classPrivateFieldGet(this, _Engine_htmlCanvasBackground, "f")), "f");
        this.drawApi = new DrawApi({
            canvas: __classPrivateFieldGet(this, _Engine_canvas, "f"),
            assets: this.assets,
        });
    }
    async init() {
        Logger.infoBeetPx(`BeetPx ${BEETPX__VERSION} will be initialized now`);
        await __classPrivateFieldGet(this, _Engine_assetLoader, "f").loadAssets(__classPrivateFieldGet(this, _Engine_assetsToLoad, "f"));
        Logger.infoBeetPx(`BeetPx ${BEETPX__VERSION} initialized`);
        return {
            startGame: __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_startGame).bind(this),
        };
    }
    setOnStarted(onStarted) {
        __classPrivateFieldSet(this, _Engine_onStarted, onStarted, "f");
    }
    setOnUpdate(onUpdate) {
        __classPrivateFieldSet(this, _Engine_onUpdate, onUpdate, "f");
    }
    setOnDraw(onDraw) {
        __classPrivateFieldSet(this, _Engine_onDraw, onDraw, "f");
    }
    restart() {
        __classPrivateFieldSet(this, _Engine_currentFrameNumber, 0, "f");
        this.audioApi.restart();
        BeetPx.clearCanvas(rgb_black_);
        __classPrivateFieldGet(this, _Engine_onStarted, "f")?.call(this);
    }
}
_a = Engine, _Engine_assetsToLoad = new WeakMap(), _Engine_browserType = new WeakMap(), _Engine_gameCanvasSize = new WeakMap(), _Engine_htmlCanvasBackground = new WeakMap(), _Engine_loading = new WeakMap(), _Engine_gameLoop = new WeakMap(), _Engine_assetLoader = new WeakMap(), _Engine_canvas = new WeakMap(), _Engine_isStarted = new WeakMap(), _Engine_onStarted = new WeakMap(), _Engine_onUpdate = new WeakMap(), _Engine_onDraw = new WeakMap(), _Engine_currentFrameNumber = new WeakMap(), _Engine_renderingFps = new WeakMap(), _Engine_alreadyResumedAudioContext = new WeakMap(), _Engine_instances = new WeakSet(), _Engine_startGame = async function _Engine_startGame() {
    if (__classPrivateFieldGet(this, _Engine_isStarted, "f")) {
        throw Error("Tried to start a game, but it is already started");
    }
    __classPrivateFieldSet(this, _Engine_isStarted, true, "f");
    if (BEETPX__IS_PROD) {
        
        
        
        
        
        
        
        window.addEventListener("beforeunload", (event) => {
            event.preventDefault();
            event.returnValue = "";
            return "";
        });
    }
    __classPrivateFieldSet(this, _Engine_currentFrameNumber, 0, "f");
    await __classPrivateFieldGet(this, _Engine_loading, "f").showStartScreen();
    __classPrivateFieldGet(this, _Engine_onStarted, "f")?.call(this);
    this.gameInput.startListening();
    __classPrivateFieldGet(this, _Engine_gameLoop, "f").start({
        updateFn: () => {
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
                    window.localStorage.removeItem(__classPrivateFieldGet(_a, _a, "f", _Engine_storageDebugDisabledKey));
                }
                else {
                    window.localStorage.setItem(__classPrivateFieldGet(_a, _a, "f", _Engine_storageDebugDisabledKey), __classPrivateFieldGet(_a, _a, "f", _Engine_storageDebugDisabledTrue));
                }
            }
            if (this.gameInput.buttonFrameByFrameToggle.wasJustPressed(false)) {
                DebugMode.toggleFrameByFrame();
            }
            const shouldUpdate = !DebugMode.frameByFrame ||
                this.gameInput.buttonFrameByFrameStep.wasJustPressed(false);
            const hasAnyInteractionHappened = this.gameInput.update({
                skipGameButtons: !shouldUpdate,
            });
            if (hasAnyInteractionHappened && !__classPrivateFieldGet(this, _Engine_alreadyResumedAudioContext, "f")) {
                this.audioApi
                    .tryToResumeAudioContextSuspendedByBrowserForSecurityReasons()
                    .then((resumed) => {
                    if (resumed) {
                        __classPrivateFieldSet(this, _Engine_alreadyResumedAudioContext, true, "f");
                    }
                });
            }
            if (shouldUpdate) {
                if (DebugMode.frameByFrame) {
                    Logger.infoBeetPx(`Running onUpdate for frame: ${__classPrivateFieldGet(this, _Engine_currentFrameNumber, "f")}`);
                }
                __classPrivateFieldGet(this, _Engine_onUpdate, "f")?.call(this);
                __classPrivateFieldSet(this, _Engine_currentFrameNumber, __classPrivateFieldGet(this, _Engine_currentFrameNumber, "f") >= Number.MAX_SAFE_INTEGER
                    ? 0
                    : __classPrivateFieldGet(this, _Engine_currentFrameNumber, "f") + 1, "f");
            }
        },
        renderFn: (renderingFps) => {
            __classPrivateFieldSet(this, _Engine_renderingFps, renderingFps, "f");
            __classPrivateFieldGet(this, _Engine_onDraw, "f")?.call(this);
            __classPrivateFieldGet(this, _Engine_canvas, "f").render();
        },
    });
};
_Engine_storageDebugDisabledKey = { value: "beetpx__debug_disabled" };
_Engine_storageDebugDisabledTrue = { value: "yes" };
