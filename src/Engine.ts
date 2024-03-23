import { BeetPx } from "./BeetPx";
import { HtmlTemplate } from "./HtmlTemplate";
import { AssetLoader, AssetsToLoad } from "./assets/AssetLoader";
import { Assets } from "./assets/Assets";
import { AudioApi } from "./audio/AudioApi";
import {
  BpxBrowserType,
  BrowserTypeDetector,
} from "./browser/BrowserTypeDetector";
import { Canvas } from "./canvas/Canvas";
import { CanvasForProduction } from "./canvas/CanvasForProduction";
import { BpxRgbColor } from "./color/RgbColor";
import { DebugMode } from "./debug/DebugMode";
import { FpsDisplay } from "./debug/FpsDisplay";
import { FrameByFrame } from "./debug/FrameByFrame";
import { DrawApi } from "./draw_api/DrawApi";
import { GameInput } from "./game_input/GameInput";
import { Button } from "./game_input/buttons/Button";
import { GameLoop } from "./game_loop/GameLoop";
import { Logger } from "./logger/Logger";
import { FullScreen } from "./misc/FullScreen";
import { Loading } from "./misc/Loading";
import { BpxVector2d } from "./misc/Vector2d";
import {
  font_pico8_,
  font_saint11Minimal4_,
  font_saint11Minimal5_,
  rgb_black_,
  v_,
} from "./shorthands";
import { StorageApi } from "./storage/StorageApi";
import { throwError } from "./utils/throwError";

export type EngineInitParams = {
  gameCanvasSize?: "64x64" | "128x128" | "256x256";
  fixedTimestep?: "30fps" | "60fps";
  assets?: AssetsToLoad;
  debugMode?: {
    /** A recommended approach would be to set it to `!window.BEETPX__IS_PROD`. */
    available?: boolean;
    /** If `true`, then the debug mode will be enabled no matter what its persisted state was. */
    forceEnabledOnStart?: boolean;
  };
  frameByFrame?: {
    /** A recommended approach would be to set it to `!window.BEETPX__IS_PROD`. */
    available?: boolean;
  };
};

export type OnAssetsLoaded = {
  startGame: () => Promise<void>;
};

export class Engine {
  readonly #assetsToLoad: AssetsToLoad;

  readonly #browserType: BpxBrowserType;

  readonly #gameCanvasSize: BpxVector2d;
  readonly #htmlCanvasBackground: BpxRgbColor =
    BpxRgbColor.fromCssHex("#000000");

  readonly #loading: Loading;
  readonly gameInput: GameInput;
  readonly #gameLoop: GameLoop;
  readonly audioApi: AudioApi;
  readonly fullScreen: FullScreen;

  readonly storageApi: StorageApi;

  readonly #assetLoader: AssetLoader;
  readonly assets: Assets;

  readonly #canvas: Canvas;
  readonly drawApi: DrawApi;

  readonly #fpsDisplay: FpsDisplay;

  #isStarted: boolean = false;

  #onStarted?: () => void;
  #onUpdate?: () => void;
  #onDraw?: () => void;

  #currentFrameNumber: number = 0;
  #renderingFps: number = 1;

  // used to indicate whether the AudioContext resume succeeded. It might have been false for the entire
  #alreadyResumedAudioContext: boolean = false;

  get frameNumber(): number {
    return this.#currentFrameNumber;
  }

  get renderingFps(): number {
    return this.#renderingFps;
  }

  get detectedBrowserType(): BpxBrowserType {
    return this.#browserType;
  }

  constructor(engineInitParams: EngineInitParams = {}) {
    engineInitParams.gameCanvasSize ??= "128x128";
    engineInitParams.fixedTimestep ??= "60fps";
    engineInitParams.assets ??= [];
    engineInitParams.debugMode ??= { available: false };
    engineInitParams.frameByFrame ??= { available: false };

    window.addEventListener("error", (event) => {
      HtmlTemplate.showError(event.message);
      // Pause music. But do it after other operations, since there
      //   might be some new unexpected an error thrown here.
      this.audioApi
        ?.getAudioContext()
        .suspend()
        .then(() => {});
      // returning `true` here means the error is already handled by us
      return true;
    });
    window.addEventListener("unhandledrejection", (event) => {
      HtmlTemplate.showError(event.reason);
      // Pause music. But do it after other operations, since there
      //   might be some new unexpected an error thrown here.
      this.audioApi
        ?.getAudioContext()
        .suspend()
        .then(() => {});
    });

    DebugMode.loadFromStorage();
    if (!engineInitParams.debugMode.available) {
      DebugMode.enabled = false;
    } else {
      if (engineInitParams.debugMode.forceEnabledOnStart) {
        DebugMode.enabled = true;
      }
    }

    Logger.debugBeetPx("Engine init params:", engineInitParams);

    this.#assetsToLoad = engineInitParams.assets;
    this.#assetsToLoad.push(...font_pico8_.spriteSheetUrls);
    this.#assetsToLoad.push(...font_saint11Minimal4_.spriteSheetUrls);
    this.#assetsToLoad.push(...font_saint11Minimal5_.spriteSheetUrls);

    const fixedTimestepFps =
      engineInitParams.fixedTimestep === "60fps"
        ? 60
        : engineInitParams.fixedTimestep === "30fps"
          ? 30
          : throwError(
              `Unsupported fixedTimestep: "${engineInitParams.fixedTimestep}"`,
            );

    Button.setRepeatingParamsFor(fixedTimestepFps);

    this.#browserType = BrowserTypeDetector.detect(navigator.userAgent);

    this.#gameCanvasSize =
      engineInitParams.gameCanvasSize === "64x64"
        ? v_(64, 64)
        : engineInitParams.gameCanvasSize === "128x128"
          ? v_(128, 128)
          : engineInitParams.gameCanvasSize === "256x256"
            ? v_(256, 256)
            : throwError(
                `Unsupported gameCanvasSize: "${engineInitParams.gameCanvasSize}"`,
              );

    this.gameInput = new GameInput({
      enableDebugToggle: engineInitParams.debugMode.available ?? false,
      enabledFrameByFrameControls:
        engineInitParams.frameByFrame.available ?? false,
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
      decodeAudioData: (arrayBuffer: ArrayBuffer) =>
        audioContext.decodeAudioData(arrayBuffer),
    });

    this.audioApi = new AudioApi(this.assets, audioContext);

    this.#loading = new Loading({
      onStartClicked: () => {
        this.audioApi
          .tryToResumeAudioContextSuspendedByBrowserForSecurityReasons()
          .then((resumed) => {
            if (resumed) {
              this.#alreadyResumedAudioContext = true;
            }
          });
      },
    });

    this.fullScreen = FullScreen.create();

    const htmlCanvas =
      document.querySelector<HTMLCanvasElement>(
        HtmlTemplate.selectors.canvas,
      ) ??
      throwError(
        `Was unable to find <canvas> by selector '${HtmlTemplate.selectors.canvas}'`,
      );

    this.#canvas = new CanvasForProduction(
      this.#gameCanvasSize,
      htmlCanvas,
      this.#htmlCanvasBackground,
    );

    this.drawApi = new DrawApi({
      canvas: this.#canvas,
      assets: this.assets,
    });

    this.#fpsDisplay = new FpsDisplay(this.drawApi, {});
  }

  async init(): Promise<OnAssetsLoaded> {
    Logger.infoBeetPx(
      `BeetPx ${window.BEETPX__VERSION} will be initialized now`,
    );
    await this.#assetLoader.loadAssets(this.#assetsToLoad);

    Logger.infoBeetPx(`BeetPx ${window.BEETPX__VERSION} initialized`);

    return {
      startGame: this.#startGame.bind(this),
    };
  }

  setOnStarted(onStarted: () => void) {
    this.#onStarted = onStarted;
  }

  setOnUpdate(onUpdate: () => void) {
    this.#onUpdate = onUpdate;
  }

  setOnDraw(onDraw: () => void) {
    this.#onDraw = onDraw;
  }

  restart() {
    this.#currentFrameNumber = 0;

    this.audioApi.restart();

    BeetPx.clearCanvas(rgb_black_);

    this.#onStarted?.();
  }

  async #startGame(): Promise<void> {
    if (this.#isStarted) {
      throw Error("Tried to start a game, but it is already started");
    }
    this.#isStarted = true;

    if (window.BEETPX__IS_PROD) {
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

    this.#currentFrameNumber = 0;

    await this.#loading.showStartScreen();

    this.#onStarted?.();

    this.gameInput.startListening();

    this.#gameLoop.start({
      updateFn: () => {
        if (this.gameInput.buttonFullScreen.wasJustPressed(false)) {
          this.fullScreen.toggleFullScreen();
        }
        if (this.gameInput.buttonMuteUnmute.wasJustPressed(false)) {
          if (this.audioApi.isAudioMuted()) {
            this.audioApi.unmuteAudio();
          } else {
            this.audioApi.muteAudio();
          }
        }
        if (this.gameInput.buttonDebugToggle.wasJustPressed(false)) {
          DebugMode.enabled = !DebugMode.enabled;
        }
        if (this.gameInput.buttonFrameByFrameToggle.wasJustPressed(false)) {
          FrameByFrame.enabled = !FrameByFrame.enabled;
        }

        const shouldUpdate =
          !FrameByFrame.enabled ||
          this.gameInput.buttonFrameByFrameStep.wasJustPressed(false);

        const hasAnyInteractionHappened = this.gameInput.update({
          skipGameButtons: !shouldUpdate,
        });
        if (hasAnyInteractionHappened && !this.#alreadyResumedAudioContext) {
          this.audioApi
            .tryToResumeAudioContextSuspendedByBrowserForSecurityReasons()
            .then((resumed) => {
              if (resumed) {
                this.#alreadyResumedAudioContext = true;
              }
            });
        }

        if (shouldUpdate) {
          if (FrameByFrame.enabled) {
            Logger.infoBeetPx(
              `Running onUpdate for frame: ${this.#currentFrameNumber}`,
            );
          }

          this.#onUpdate?.();

          this.#currentFrameNumber =
            this.#currentFrameNumber >= Number.MAX_SAFE_INTEGER
              ? 0
              : this.#currentFrameNumber + 1;
        }
      },
      renderFn: (renderingFps) => {
        this.#renderingFps = renderingFps;

        this.#onDraw?.();

        if (DebugMode.enabled) {
          this.#fpsDisplay.drawRenderingFps(renderingFps);
        }

        this.#canvas.render();
      },
    });
  }
}
