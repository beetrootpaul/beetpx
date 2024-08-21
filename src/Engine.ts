import { HtmlTemplate } from "./HtmlTemplate";
import { AssetLoader, BpxAssetsToLoad } from "./assets/AssetLoader";
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
import { BpxFpsDisplayPlacement, FpsDisplay } from "./debug/FpsDisplay";
import { FrameByFrame } from "./debug/FrameByFrame";
import { DrawApi } from "./draw_api/DrawApi";
import { GameInput } from "./game_input/GameInput";
import { GameLoop } from "./game_loop/GameLoop";
import { Logger } from "./logger/Logger";
import { FullScreen } from "./misc/FullScreen";
import { Loading } from "./misc/Loading";
import { ScreenshotManager } from "./misc/ScreenshotManager";
import { BpxVector2d } from "./misc/Vector2d";
import { GamePause } from "./pause/GamePause";
import {
  $font_pico8,
  $font_saint11Minimal4,
  $font_saint11Minimal5,
  $rgb_black,
  $v,
} from "./shorthands";
import { ScopedLocaleStorage } from "./storage/ScopedLocaleStorage";
import { StorageApi } from "./storage/StorageApi";
import { throwError } from "./utils/throwError";

/**
 * The configuration of the BeetPx engine. Passed into {@link BeetPx.start}.
 *
 * @category Core
 */
export type BpxEngineConfig = {
  /**
   * Used for scoping localStorage keys, so two different games won't override their persisted state.
   *
   * An example: built-in screenshots feature binds screenshots to the proper game by its `gameId`.
   */
  gameId: string;

  /**
   * The logical canvas size. Not to be mistaken with a size of the HTML Canvas, which the user has no control over.
   *
   * During the game, this value (as a {@link BpxVector2d} can be obtained with {@link BeetPx.canvasSize}.
   */
  canvasSize?: "64x64" | "128x128" | "256x256" | "192x108";

  /**
   * The desired frequency of update calls. This is a basis for all time-based computations
   * in the game, since BeetPx has no notion of the real time, nor delta time between update calls.
   * The entire engine is based in a fixed timestep computations, where you can expect each game loop
   * iteration to happen after the similar amount of time from the previous one.
   *
   * 60 FPS games looks smoother, but require more performant machine, if the game logic is
   * computation heavy.
   *
   * PleaseThis setting does *not* imply the rendering FPS, which is decoupled from the update calls.
   */
  fixedTimestep?: "30fps" | "60fps";

  /**
   * A list of URLs of assets to load. The URLs might be either relative to the `./public/` directory,
   * or external ones.
   *
   * Allowed file extensions:
   * - `.png` – for images,
   * - `.wav` – for music,
   * - `.flac` – for music, smaller files than `.wav`,
   * - `.json` – for JSON files,
   * - `.ldtk` – a convenience extension support for JSON files with the default extension used by [LDtk](https://ldtk.io/) tool, so you doesn't have to rename them.
   *
   * @example
   * ```ts
   * $x.start({
   *   // ...
   *   assets: [
   *     "spriteshet.png",    // refers to `./public/spriteshet.png`
   *     "music/track1.flac", // refers to `./public/music/track1.flac`
   *     "https://the.url/of/level.ldtk",
   *   ],
   * });
   * ```
   */
  assets?: BpxAssetsToLoad;

  /**
   * A feature which allows to toggle a game pause with use of a "menu" button.
   * When active, the timers, animations, and music do not progress, unless configured to ignore the pause.
   *
   * This also allows to implement a pause menu.
   *
   * @example
   * ```ts
   * $x.setOnDraw(() => {
   *   // ...
   *   if ($x.isPaused) {
   *     pauseMenu.draw();
   *   }
   * });
   * ```
   *
   * @see https://github.com/beetrootpaul/beetpx-examples/tree/main/pause-and-restart
   */
  gamePause?: {
    /**
     * Whether the game pause should be available (and automatically toggled with the "menu" button).
     */
    available?: boolean;
  };
  /**
   * Whether to prevent user from accidentally closing the browser tab with the game running.
   *
   * A recommended approach would be to set it to {@link BEETPX__IS_PROD}
   *
   * @example
   * ```ts
   * $x.start({
   *   // ...,
   *   requireConfirmationOnTabClose: BEETPX__IS_PROD,
   * });
   * ```
   */
  requireConfirmationOnTabClose?: boolean;

  screenshots?: {
    /**
     * Whether to allow user to take screenshots of the game (with use of the `]` key)
     * and access the screenshot browser overlay (with use of the `}` key).
     */
    available?: boolean;
  };

  /**
   * A mode in which you can perform an additional logic, draw helpful markers, etc.
   * When active, the {@link BeetPx.debug} returns `true`.
   *
   * Visually, this mode is indicated by an orange border around the game canvas.
   *
   * When inactive, the {@link BeetPx.logDebug} are not printed.
   *
   * @example
   * ```ts
   * $d.sprite(playerSprite, xy);
   * if ($x.debug) {
   *   $d.rect(xy, playerSprite.size, $rgb_red);
   * }
   * ```
   */
  debugMode?: {
    /**
     * Whether to allow use to toggle the debug mode (with use of the `;` key).
     *
     * A recommended approach would be to set it to the negation of {@link BEETPX__IS_PROD}.
     */
    available?: boolean;

    /**
     * Whether to activate the debug mode from the game start. Useful, when you
     * want to investigate what happens on the very first frame. This setting ignores
     * the persisted state of whether the debug mode was activated the last time the games was run.
     */
    forceEnabledOnStart?: boolean;

    /**
     * FPS Display shows the rendering FPS in one of the canvas corners, when in enabled and in the debug mode.
     */
    fpsDisplay?: {
      /**
       * Whether the FPS Display should be shown in the debug mode.
       */
      enabled?: boolean;

      /**
       * The color of the printed FPS on the canvas.
       */
      color?: BpxRgbColor;

      /**
       * The placement of the printed FPS on the canvas.
       */
      placement?: BpxFpsDisplayPlacement;
    };
  };
  frameByFrame?: {
    /**
     * Whether to allow use to toggle the frame-by-frame mode (with use of the `,` key),
     * and (when in that mode) to progress to the next frame (with use of the `.` key).
     *
     * A recommended approach would be to set it to the negation of {@link BEETPX__IS_PROD}.
     */
    available?: boolean;

    /**
     * Whether to activate the frame-by-frame mode from the game start. Useful, when you
     * want to investigate what happens on the very first frame.
     */
    activateOnStart?: boolean;
  };
};

export type OnEngineInitialized = {
  startGame: () => Promise<void>;
};

export class Engine {
  static engineSingleton: Engine | undefined;

  readonly #config: BpxEngineConfig;

  readonly #assetsToLoad: BpxAssetsToLoad;

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

  readonly #screenshotManager?: ScreenshotManager;

  #isStarted: boolean = false;
  isInsideDrawOrStartedCallback: boolean = false;

  #onStarted?: () => void;
  #onUpdate?: () => void;
  #onDraw?: () => void;

  #onPreUpdate?: () => void;

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

  constructor(engineConfig: BpxEngineConfig) {
    this.#config = engineConfig;

    engineConfig.canvasSize ??= "128x128";
    engineConfig.fixedTimestep ??= "60fps";

    ScopedLocaleStorage.gameId = engineConfig.gameId;

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
      engineConfig.fixedTimestep === "60fps"
        ? 60
        : engineConfig.fixedTimestep === "30fps"
          ? 30
          : throwError(
              `Unsupported fixedTimestep: "${engineConfig.fixedTimestep}"`,
            );

    this.#browserType = BrowserTypeDetector.detect(navigator.userAgent);

    this.canvasSize =
      engineConfig.canvasSize === "64x64"
        ? $v(64, 64)
        : engineConfig.canvasSize === "128x128"
          ? $v(128, 128)
          : engineConfig.canvasSize === "256x256"
            ? $v(256, 256)
            : engineConfig.canvasSize === "192x108"
              ? $v(192, 108)
              : throwError(
                  `Unsupported canvasSize: "${engineConfig.canvasSize}"`,
                );

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

    if (engineConfig?.screenshots?.available) {
      this.#screenshotManager = new ScreenshotManager();
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
    this.#onPreUpdate = () => {
      this.#onPreUpdate = undefined;

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
    };
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

    await this.#loading.showStartScreen();

    this.gameInput.startListening();

    this.#onPreUpdate = () => {
      this.#onPreUpdate = undefined;

      this.#currentFrameNumber = 0;
      this.#currentFrameNumberOutsidePause = 0;

      this.isInsideDrawOrStartedCallback = true;
      this.#onStarted?.();
      this.isInsideDrawOrStartedCallback = false;
    };

    const updateFn = () => {
      const shouldUpdate =
        !FrameByFrame.active ||
        this.gameInput.buttonFrameByFrameStep.wasJustPressed;

      if (shouldUpdate) {
        this.#currentFrameNumber =
          this.#currentFrameNumber >= Number.MAX_SAFE_INTEGER
            ? 0
            : this.#currentFrameNumber + 1;
        if (!GamePause.isActive) {
          this.#currentFrameNumberOutsidePause =
            this.#currentFrameNumberOutsidePause >= Number.MAX_SAFE_INTEGER
              ? 0
              : this.#currentFrameNumberOutsidePause + 1;
        }

        this.#onPreUpdate?.();
      }

      if (this.#screenshotManager) {
        if (this.gameInput.buttonBrowseScreenshots.wasJustPressed) {
          this.#screenshotManager.isBrowsing =
            !this.#screenshotManager.isBrowsing;
          HtmlTemplate.updateBrowsingScreenshotsClass(
            this.#screenshotManager.isBrowsing,
          );
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
      }
    };

    const renderFn = (renderingFps: number) => {
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
    };

    this.#gameLoop.start({
      updateFn,
      renderFn,
    });
  }
}
