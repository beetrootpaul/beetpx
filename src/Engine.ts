import { HtmlTemplate } from "./HtmlTemplate";
import { AssetLoader, AssetsToLoad } from "./assets/AssetLoader";
import { Assets } from "./assets/Assets";
import { AudioApi } from "./audio/AudioApi";
import { AudioPlayback } from "./audio/AudioPlayback";
import {
  BpxBrowserType,
  BrowserTypeDetector,
} from "./browser/BrowserTypeDetector";
import { Canvas } from "./canvas/Canvas";
import { CanvasForProduction } from "./canvas/CanvasForProduction";
import { BpxRgbColor } from "./color/RgbColor";
import { DebugMode } from "./debug/DebugMode";
import { FpsDisplay, FpsDisplayPlacement } from "./debug/FpsDisplay";
import { FrameByFrame } from "./debug/FrameByFrame";
import { DrawApi } from "./draw_api/DrawApi";
import { GameInput } from "./game_input/GameInput";
import { GameLoop } from "./game_loop/GameLoop";
import { Logger } from "./logger/Logger";
import { FullScreen } from "./misc/FullScreen";
import { Loading } from "./misc/Loading";
import { BpxVector2d } from "./misc/Vector2d";
import { GamePause } from "./pause/GamePause";
import {
  $font_pico8,
  $font_saint11Minimal4,
  $font_saint11Minimal5,
  $rgb_black,
  $v,
} from "./shorthands";
import { StorageApi } from "./storage/StorageApi";
import { throwError } from "./utils/throwError";

export type BpxEngineConfig = {
  canvasSize?: "64x64" | "128x128" | "256x256";
  fixedTimestep?: "30fps" | "60fps";
  assets?: AssetsToLoad;
  gamePause?: {
    available?: boolean;
  };
  requireConfirmationOnTabClose?: boolean;
  debugMode?: {
    /** A recommended approach would be to set it to `!window.BEETPX__IS_PROD`. */
    available?: boolean;
    /** If `true`, then the debug mode will be enabled on start no matter what its persisted state was. */
    forceEnabledOnStart?: boolean;
    fpsDisplay?: {
      enabled?: boolean;
      color?: BpxRgbColor;
      placement?: FpsDisplayPlacement;
    };
  };
  frameByFrame?: {
    /** A recommended approach would be to set it to `!window.BEETPX__IS_PROD`. */
    available?: boolean;
    /** If `true`, then the frame-by-frame mode will be activated from the very start. */
    activateOnStart?: boolean;
  };
};

export type OnEngineInitialized = {
  startGame: () => Promise<void>;
};

export class Engine {
  static engineSingleton: Engine | undefined;

  readonly #config: BpxEngineConfig;

  readonly #assetsToLoad: AssetsToLoad;

  readonly #browserType: BpxBrowserType;

  readonly canvasSize: BpxVector2d;
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

  readonly #fpsDisplay?: FpsDisplay;

  #isStarted: boolean = false;
  isInsideDrawOrStartedCallback: boolean = false;

  #onStarted?: () => void;
  #onUpdate?: () => void;
  #onDraw?: () => void;

  #currentFrameNumber: number = 0;
  #currentFrameNumberOutsidePause: number = 0;
  #renderingFps: number = 1;

  // Used to prevent a situation when there is a strange state of game drawn before the very first
  // update call. It happens, when initial game state (e.g. positions) are set to values different
  // than what is assigned to them in the update call.
  #wasUpdateCalledAtLeastOnce: boolean = false;

  // used to indicate whether the AudioContext resume succeeded. It might have been false for the entire
  #alreadyResumedAudioContext: boolean = false;

  get frameNumber(): number {
    return this.#currentFrameNumber;
  }

  get frameNumberOutsidePause(): number {
    return this.#currentFrameNumberOutsidePause;
  }

  get renderingFps(): number {
    return this.#renderingFps;
  }

  get detectedBrowserType(): BpxBrowserType {
    return this.#browserType;
  }

  constructor(engineConfig?: BpxEngineConfig) {
    engineConfig ??= {};
    this.#config = engineConfig;

    engineConfig.canvasSize ??= "128x128";
    engineConfig.fixedTimestep ??= "60fps";

    window.addEventListener("error", event => {
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
    window.addEventListener("unhandledrejection", event => {
      HtmlTemplate.showError(event.reason);
      // Pause music. But do it after other operations, since there
      //   might be some new unexpected an error thrown here.
      this.audioApi
        ?.getAudioContext()
        .suspend()
        .then(() => {});
    });

    if (engineConfig.gamePause?.available) {
      GamePause.enable();
    }

    DebugMode.loadFromStorage();
    if (!engineConfig.debugMode?.available) {
      DebugMode.enabled = false;
    } else {
      if (engineConfig.debugMode.forceEnabledOnStart) {
        DebugMode.enabled = true;
      }
    }

    if (
      engineConfig.frameByFrame?.available &&
      engineConfig.frameByFrame?.activateOnStart
    ) {
      FrameByFrame.active = true;
    }

    Logger.debugBeetPx("Engine init params:", engineConfig);

    this.#assetsToLoad = engineConfig.assets ?? [];
    this.#assetsToLoad.push(...$font_pico8.spriteSheetUrls);
    this.#assetsToLoad.push(...$font_saint11Minimal4.spriteSheetUrls);
    this.#assetsToLoad.push(...$font_saint11Minimal5.spriteSheetUrls);

    const fixedTimestepFps =
      engineConfig.fixedTimestep === "60fps" ? 60
      : engineConfig.fixedTimestep === "30fps" ? 30
      : throwError(
          `Unsupported fixedTimestep: "${engineConfig.fixedTimestep}"`,
        );

    this.#browserType = BrowserTypeDetector.detect(navigator.userAgent);

    this.canvasSize =
      engineConfig.canvasSize === "64x64" ? $v(64, 64)
      : engineConfig.canvasSize === "128x128" ? $v(128, 128)
      : engineConfig.canvasSize === "256x256" ? $v(256, 256)
      : throwError(`Unsupported canvasSize: "${engineConfig.canvasSize}"`);

    this.gameInput = new GameInput({
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
      decodeAudioData: (arrayBuffer: ArrayBuffer) =>
        audioContext.decodeAudioData(arrayBuffer),
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

    const htmlCanvas =
      document.querySelector<HTMLCanvasElement>(
        HtmlTemplate.selectors.canvas,
      ) ??
      throwError(
        `Was unable to find <canvas> by selector '${HtmlTemplate.selectors.canvas}'`,
      );

    this.#canvas = new CanvasForProduction(
      this.canvasSize,
      htmlCanvas,
      this.#htmlCanvasBackground,
    );

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
  }

  async init(): Promise<OnEngineInitialized> {
    await this.#assetLoader.loadAssets(this.#assetsToLoad);
    return {
      startGame: this.#startGame.bind(this),
    };
  }

  setOnStarted(onStarted?: () => void): void {
    this.#onStarted = onStarted;
  }

  setOnUpdate(onUpdate?: () => void): void {
    this.#onUpdate = onUpdate;
  }

  setOnDraw(onDraw?: () => void): void {
    this.#onDraw = onDraw;
  }

  restart(): void {
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

  async #startGame(): Promise<void> {
    if (this.#isStarted) {
      throw Error("Tried to start a game, but it is already started");
    }
    this.#isStarted = true;

    if (this.#config.requireConfirmationOnTabClose) {
      // A popup which prevents user from accidentally closing the browser tab during gameplay.
      // Implementation notes:
      // - returned message seems to be ignored by some browsers, therefore using `""`
      // - this event is *not* always run when for example there was no mouse click inside
      //   iframe with the game in Firefox
      // - there are two ways of implementing this, because of browsers incompatibilities,
      //   therefore using both of them here (`event.returnValue =` and `return`)
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
        if (this.gameInput.buttonFullScreen.wasJustPressed) {
          this.fullScreen.toggleFullScreen();
        }
        if (this.gameInput.buttonMuteUnmute.wasJustPressed) {
          if (this.audioApi.isAudioMuted()) {
            this.audioApi.unmuteAudio();
          } else {
            this.audioApi.muteAudio();
          }
        }

        if (this.gameInput.gameButtons.wasJustPressed("menu")) {
          if (GamePause.isActive) {
            GamePause.deactivate();
          } else {
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

        const shouldUpdate =
          !FrameByFrame.active ||
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
            Logger.infoBeetPx(
              `Running onUpdate for frame: ${this.#currentFrameNumber}`,
            );
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
