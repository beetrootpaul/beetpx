import { HtmlTemplate } from "./HtmlTemplate";
import { AssetLoader } from "./assets/AssetLoader";
import { Assets } from "./assets/Assets";
import { AudioApi } from "./audio/AudioApi";
import { AudioPlayback } from "./audio/AudioPlayback";
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
import { ScreenshotManager } from "./misc/ScreenshotManager";
import { GamePause } from "./pause/GamePause";
import { $font_pico8, $font_saint11Minimal4, $font_saint11Minimal5, $rgb_black, $v, } from "./shorthands";
import { ScopedLocaleStorage } from "./storage/ScopedLocaleStorage";
import { StorageApi } from "./storage/StorageApi";
import { throwError } from "./utils/throwError";
export class Engine {
    static engineSingleton;
    #config;
    #assetsToLoad;
    #browserType;
    canvasSize;
    #htmlCanvasBackground = BpxRgbColor.fromCssHex("#000000");
    #loading;
    gameInput;
    #gameLoop;
    audioApi;
    fullScreen;
    storageApi;
    #assetLoader;
    assets;
    #canvas;
    drawApi;
    #fpsDisplay;
    #screenshotManager;
    #isStarted = false;
    isInsideDrawOrStartedCallback = false;
    #onStarted;
    #onUpdate;
    #onDraw;
    #currentFrameNumber = 0;
    #currentFrameNumberOutsidePause = 0;
    #renderingFps = 1;
    
    
    
    #wasUpdateCalledAtLeastOnce = false;
    
    #alreadyResumedAudioContext = false;
    get frameNumber() {
        return this.#currentFrameNumber;
    }
    get frameNumberOutsidePause() {
        return this.#currentFrameNumberOutsidePause;
    }
    get renderingFps() {
        return this.#renderingFps;
    }
    get detectedBrowserType() {
        return this.#browserType;
    }
    constructor(engineConfig) {
        this.#config = engineConfig;
        engineConfig.canvasSize ??= "128x128";
        engineConfig.fixedTimestep ??= "60fps";
        ScopedLocaleStorage.gameId = engineConfig.gameId;
        window.addEventListener("error", event => {
            HtmlTemplate.showError(event.message);
            
            
            this.audioApi
                ?.getAudioContext()
                .suspend()
                .then(() => { });
            
            return true;
        });
        window.addEventListener("unhandledrejection", event => {
            HtmlTemplate.showError(event.reason);
            
            
            this.audioApi
                ?.getAudioContext()
                .suspend()
                .then(() => { });
        });
        if (engineConfig.gamePause?.available) {
            GamePause.enable();
        }
        DebugMode.loadFromStorage();
        if (!engineConfig.debugMode?.available) {
            DebugMode.enabled = false;
        }
        else {
            if (engineConfig.debugMode.forceEnabledOnStart) {
                DebugMode.enabled = true;
            }
        }
        if (engineConfig.frameByFrame?.available &&
            engineConfig.frameByFrame?.activateOnStart) {
            FrameByFrame.active = true;
        }
        Logger.debugBeetPx("Engine init params:", engineConfig);
        this.#assetsToLoad = engineConfig.assets ?? [];
        this.#assetsToLoad.push(...$font_pico8.spriteSheetUrls);
        this.#assetsToLoad.push(...$font_saint11Minimal4.spriteSheetUrls);
        this.#assetsToLoad.push(...$font_saint11Minimal5.spriteSheetUrls);
        const fixedTimestepFps = engineConfig.fixedTimestep === "60fps" ? 60
            : engineConfig.fixedTimestep === "30fps" ? 30
                : throwError(`Unsupported fixedTimestep: "${engineConfig.fixedTimestep}"`);
        this.#browserType = BrowserTypeDetector.detect(navigator.userAgent);
        this.canvasSize =
            engineConfig.canvasSize === "64x64" ? $v(64, 64)
                : engineConfig.canvasSize === "128x128" ? $v(128, 128)
                    : engineConfig.canvasSize === "256x256" ? $v(256, 256)
                        : throwError(`Unsupported canvasSize: "${engineConfig.canvasSize}"`);
        this.gameInput = new GameInput({
            enableScreenshots: engineConfig.screenshots?.available ?? false,
            enableDebugToggle: engineConfig.debugMode?.available ?? false,
            enableFrameByFrameControls: engineConfig.frameByFrame?.available ?? false,
            browserType: this.#browserType,
        });
        this.#gameLoop = new GameLoop({
            fixedTimestepFps: fixedTimestepFps,
            rafFn: window.requestAnimationFrame.bind(window),
            documentVisibilityStateProvider: document,
        });
        this.storageApi = new StorageApi();
        const audioContext = new AudioContext();
        this.assets = new Assets();
        this.#assetLoader = new AssetLoader(this.assets, {
            decodeAudioData: (arrayBuffer) => audioContext.decodeAudioData(arrayBuffer),
        });
        this.audioApi = new AudioApi(this.assets, audioContext);
        this.#loading = new Loading({
            onStartClicked: () => {
                this.audioApi
                    .tryToResumeAudioContextSuspendedByBrowserForSecurityReasons()
                    .then(resumed => {
                    if (resumed) {
                        this.#alreadyResumedAudioContext = true;
                    }
                });
            },
        });
        this.fullScreen = FullScreen.create();
        const htmlCanvas = document.querySelector(HtmlTemplate.selectors.canvas) ??
            throwError(`Was unable to find <canvas> by selector '${HtmlTemplate.selectors.canvas}'`);
        this.#canvas = new CanvasForProduction(this.canvasSize, htmlCanvas, this.#htmlCanvasBackground);
        this.drawApi = new DrawApi({
            canvas: this.#canvas,
            assets: this.assets,
        });
        if (engineConfig.debugMode?.fpsDisplay?.enabled) {
            this.#fpsDisplay = new FpsDisplay(this.drawApi, this.canvasSize, {
                color: engineConfig.debugMode.fpsDisplay.color,
                placement: engineConfig.debugMode.fpsDisplay.placement,
            });
        }
        if (engineConfig?.screenshots?.available) {
            this.#screenshotManager = new ScreenshotManager();
        }
    }
    async init() {
        await this.#assetLoader.loadAssets(this.#assetsToLoad);
        return {
            startGame: this.#startGame.bind(this),
        };
    }
    setOnStarted(onStarted) {
        this.#onStarted = onStarted;
    }
    setOnUpdate(onUpdate) {
        this.#onUpdate = onUpdate;
    }
    setOnDraw(onDraw) {
        this.#onDraw = onDraw;
    }
    restart() {
        this.#currentFrameNumber = 0;
        this.#currentFrameNumberOutsidePause = 0;
        this.audioApi.restart();
        this.drawApi.clearCanvas($rgb_black);
        AudioPlayback.playbacksToPauseOnGamePause.clear();
        AudioPlayback.playbacksToMuteOnGamePause.clear();
        GamePause.deactivate();
        this.isInsideDrawOrStartedCallback = true;
        this.#onStarted?.();
        this.isInsideDrawOrStartedCallback = false;
    }
    async #startGame() {
        if (this.#isStarted) {
            throw Error("Tried to start a game, but it is already started");
        }
        this.#isStarted = true;
        if (this.#config.requireConfirmationOnTabClose) {
            
            
            
            
            
            
            
            window.addEventListener("beforeunload", event => {
                event.preventDefault();
                event.returnValue = "";
                return "";
            });
        }
        this.#currentFrameNumber = 0;
        this.#currentFrameNumberOutsidePause = 0;
        await this.#loading.showStartScreen();
        this.isInsideDrawOrStartedCallback = true;
        this.#onStarted?.();
        this.isInsideDrawOrStartedCallback = false;
        this.gameInput.startListening();
        this.#gameLoop.start({
            updateFn: () => {
                if (this.#screenshotManager) {
                    if (this.gameInput.buttonBrowseScreenshots.wasJustPressed) {
                        this.#screenshotManager.isBrowsing =
                            !this.#screenshotManager.isBrowsing;
                        HtmlTemplate.updateBrowsingScreenshotsClass(this.#screenshotManager.isBrowsing);
                    }
                }
                if (this.#screenshotManager) {
                    if (this.gameInput.buttonTakeScreenshot.wasJustPressed) {
                        this.#screenshotManager.addScreenshot(this.#canvas.asDataUrl());
                    }
                }
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
                if (this.gameInput.gameButtons.wasJustPressed("menu")) {
                    if (GamePause.isActive) {
                        GamePause.deactivate();
                    }
                    else {
                        GamePause.activate();
                    }
                }
                GamePause.update();
                if (this.gameInput.buttonDebugToggle.wasJustPressed) {
                    DebugMode.enabled = !DebugMode.enabled;
                }
                if (this.gameInput.buttonFrameByFrameToggle.wasJustPressed) {
                    FrameByFrame.active = !FrameByFrame.active;
                }
                const shouldUpdate = !FrameByFrame.active ||
                    this.gameInput.buttonFrameByFrameStep.wasJustPressed;
                const hasAnyInteractionHappened = this.gameInput.update({
                    skipGameButtons: !shouldUpdate,
                });
                if (hasAnyInteractionHappened && !this.#alreadyResumedAudioContext) {
                    this.audioApi
                        .tryToResumeAudioContextSuspendedByBrowserForSecurityReasons()
                        .then(resumed => {
                        if (resumed) {
                            this.#alreadyResumedAudioContext = true;
                        }
                    });
                }
                if (shouldUpdate) {
                    if (FrameByFrame.active) {
                        Logger.infoBeetPx(`Running onUpdate for frame: ${this.#currentFrameNumber}`);
                    }
                    this.#onUpdate?.();
                    this.#wasUpdateCalledAtLeastOnce = true;
                    this.#currentFrameNumber =
                        this.#currentFrameNumber >= Number.MAX_SAFE_INTEGER ?
                            0
                            : this.#currentFrameNumber + 1;
                    if (!GamePause.isActive) {
                        this.#currentFrameNumberOutsidePause =
                            this.#currentFrameNumberOutsidePause >= Number.MAX_SAFE_INTEGER ?
                                0
                                : this.#currentFrameNumberOutsidePause + 1;
                    }
                }
            },
            renderFn: renderingFps => {
                this.#renderingFps = renderingFps;
                this.isInsideDrawOrStartedCallback = true;
                if (this.#wasUpdateCalledAtLeastOnce) {
                    this.#onDraw?.();
                    if (DebugMode.enabled) {
                        this.#fpsDisplay?.drawRenderingFps(renderingFps);
                    }
                }
                this.isInsideDrawOrStartedCallback = false;
                this.#canvas.render();
            },
        });
    }
}
