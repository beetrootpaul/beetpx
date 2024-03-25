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
var _Engine_instances, _Engine_assetsToLoad, _Engine_browserType, _Engine_gameCanvasSize, _Engine_htmlCanvasBackground, _Engine_loading, _Engine_gameLoop, _Engine_assetLoader, _Engine_canvas, _Engine_fpsDisplay, _Engine_isStarted, _Engine_onStarted, _Engine_onUpdate, _Engine_onDraw, _Engine_currentFrameNumber, _Engine_renderingFps, _Engine_alreadyResumedAudioContext, _Engine_startGame;
import { BeetPx } from "./BeetPx";
import { HtmlTemplate } from "./HtmlTemplate";
import { AssetLoader } from "./assets/AssetLoader";
import { Assets } from "./assets/Assets";
import { AudioApi } from "./audio/AudioApi";
import { BrowserTypeDetector, } from "./browser/BrowserTypeDetector";
import { CanvasForProduction } from "./canvas/CanvasForProduction";
import { BpxRgbColor } from "./color/RgbColor";
import { DebugMode } from "./debug/DebugMode";
import { FpsDisplay } from "./debug/FpsDisplay";
import { FrameByFrame } from "./debug/FrameByFrame";
import { DrawApi } from "./draw_api/DrawApi";
import { GameInput } from "./game_input/GameInput";
import { GameLoop } from "./game_loop/GameLoop";
import { Logger } from "./logger/Logger";
import { FullScreen } from "./misc/FullScreen";
import { Loading } from "./misc/Loading";
import { font_pico8_, font_saint11Minimal4_, font_saint11Minimal5_, rgb_black_, v_, } from "./shorthands";
import { StorageApi } from "./storage/StorageApi";
import { throwError } from "./utils/throwError";
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
    constructor(engineConfig = {}) {
        _Engine_instances.add(this);
        _Engine_assetsToLoad.set(this, void 0);
        _Engine_browserType.set(this, void 0);
        _Engine_gameCanvasSize.set(this, void 0);
        _Engine_htmlCanvasBackground.set(this, BpxRgbColor.fromCssHex("#000000"));
        _Engine_loading.set(this, void 0);
        _Engine_gameLoop.set(this, void 0);
        _Engine_assetLoader.set(this, void 0);
        _Engine_canvas.set(this, void 0);
        _Engine_fpsDisplay.set(this, void 0);
        _Engine_isStarted.set(this, false);
        _Engine_onStarted.set(this, void 0);
        _Engine_onUpdate.set(this, void 0);
        _Engine_onDraw.set(this, void 0);
        _Engine_currentFrameNumber.set(this, 0);
        _Engine_renderingFps.set(this, 1);
        
        _Engine_alreadyResumedAudioContext.set(this, false);
        engineConfig.gameCanvasSize ?? (engineConfig.gameCanvasSize = "128x128");
        engineConfig.fixedTimestep ?? (engineConfig.fixedTimestep = "60fps");
        engineConfig.assets ?? (engineConfig.assets = []);
        engineConfig.debugMode ?? (engineConfig.debugMode = { available: false });
        engineConfig.frameByFrame ?? (engineConfig.frameByFrame = { available: false });
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
        DebugMode.loadFromStorage();
        if (!engineConfig.debugMode.available) {
            DebugMode.enabled = false;
        }
        else {
            if (engineConfig.debugMode.forceEnabledOnStart) {
                DebugMode.enabled = true;
            }
        }
        Logger.debugBeetPx("Engine init params:", engineConfig);
        __classPrivateFieldSet(this, _Engine_assetsToLoad, engineConfig.assets, "f");
        __classPrivateFieldGet(this, _Engine_assetsToLoad, "f").push(...font_pico8_.spriteSheetUrls);
        __classPrivateFieldGet(this, _Engine_assetsToLoad, "f").push(...font_saint11Minimal4_.spriteSheetUrls);
        __classPrivateFieldGet(this, _Engine_assetsToLoad, "f").push(...font_saint11Minimal5_.spriteSheetUrls);
        const fixedTimestepFps = engineConfig.fixedTimestep === "60fps"
            ? 60
            : engineConfig.fixedTimestep === "30fps"
                ? 30
                : throwError(`Unsupported fixedTimestep: "${engineConfig.fixedTimestep}"`);
        __classPrivateFieldSet(this, _Engine_browserType, BrowserTypeDetector.detect(navigator.userAgent), "f");
        __classPrivateFieldSet(this, _Engine_gameCanvasSize, engineConfig.gameCanvasSize === "64x64"
            ? v_(64, 64)
            : engineConfig.gameCanvasSize === "128x128"
                ? v_(128, 128)
                : engineConfig.gameCanvasSize === "256x256"
                    ? v_(256, 256)
                    : throwError(`Unsupported gameCanvasSize: "${engineConfig.gameCanvasSize}"`), "f");
        this.gameInput = new GameInput({
            enableDebugToggle: engineConfig.debugMode.available ?? false,
            enabledFrameByFrameControls: engineConfig.frameByFrame.available ?? false,
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
            throwError(`Was unable to find <canvas> by selector '${HtmlTemplate.selectors.canvas}'`);
        __classPrivateFieldSet(this, _Engine_canvas, new CanvasForProduction(__classPrivateFieldGet(this, _Engine_gameCanvasSize, "f"), htmlCanvas, __classPrivateFieldGet(this, _Engine_htmlCanvasBackground, "f")), "f");
        this.drawApi = new DrawApi({
            canvas: __classPrivateFieldGet(this, _Engine_canvas, "f"),
            assets: this.assets,
        });
        if (engineConfig.debugMode.fpsDisplay?.enabled) {
            __classPrivateFieldSet(this, _Engine_fpsDisplay, new FpsDisplay(this.drawApi, __classPrivateFieldGet(this, _Engine_gameCanvasSize, "f"), {
                color: engineConfig.debugMode.fpsDisplay.color,
                placement: engineConfig.debugMode.fpsDisplay.placement,
            }), "f");
        }
    }
    async init() {
        await __classPrivateFieldGet(this, _Engine_assetLoader, "f").loadAssets(__classPrivateFieldGet(this, _Engine_assetsToLoad, "f"));
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
_Engine_assetsToLoad = new WeakMap(), _Engine_browserType = new WeakMap(), _Engine_gameCanvasSize = new WeakMap(), _Engine_htmlCanvasBackground = new WeakMap(), _Engine_loading = new WeakMap(), _Engine_gameLoop = new WeakMap(), _Engine_assetLoader = new WeakMap(), _Engine_canvas = new WeakMap(), _Engine_fpsDisplay = new WeakMap(), _Engine_isStarted = new WeakMap(), _Engine_onStarted = new WeakMap(), _Engine_onUpdate = new WeakMap(), _Engine_onDraw = new WeakMap(), _Engine_currentFrameNumber = new WeakMap(), _Engine_renderingFps = new WeakMap(), _Engine_alreadyResumedAudioContext = new WeakMap(), _Engine_instances = new WeakSet(), _Engine_startGame = async function _Engine_startGame() {
    if (__classPrivateFieldGet(this, _Engine_isStarted, "f")) {
        throw Error("Tried to start a game, but it is already started");
    }
    __classPrivateFieldSet(this, _Engine_isStarted, true, "f");
    if (window.BEETPX__IS_PROD) {
        
        
        
        
        
        
        
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
            if (this.gameInput.buttonFullScreen.wasJustPressed) {
                this.fullScreen.toggleFullScreen();
            }
            if (this.gameInput.buttonMuteUnmute.wasJustPressed) {
                if (this.audioApi.isAudioMuted()) {
                    this.audioApi.unmuteAudio();
                }
                else {
                    this.audioApi.muteAudio();
                }
            }
            if (this.gameInput.buttonDebugToggle.wasJustPressed) {
                DebugMode.enabled = !DebugMode.enabled;
            }
            if (this.gameInput.buttonFrameByFrameToggle.wasJustPressed) {
                FrameByFrame.enabled = !FrameByFrame.enabled;
            }
            const shouldUpdate = !FrameByFrame.enabled ||
                this.gameInput.buttonFrameByFrameStep.wasJustPressed;
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
                if (FrameByFrame.enabled) {
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
            if (DebugMode.enabled) {
                __classPrivateFieldGet(this, _Engine_fpsDisplay, "f")?.drawRenderingFps(renderingFps);
            }
            __classPrivateFieldGet(this, _Engine_canvas, "f").render();
        },
    });
};
