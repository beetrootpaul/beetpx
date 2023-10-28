import { Assets, AssetsToLoad } from "./Assets";
import { BeetPx } from "./BeetPx";
import { BpxSolidColor, black_ } from "./Color";
import { FullScreen } from "./FullScreen";
import { HtmlTemplate } from "./HtmlTemplate";
import { Loading } from "./Loading";
import { BpxUtils, u_ } from "./Utils";
import { BpxVector2d, v_ } from "./Vector2d";
import { AudioApi } from "./audio/AudioApi";
import {
  BpxBrowserType,
  BrowserTypeDetector,
} from "./browser/BrowserTypeDetector";
import { DebugMode } from "./debug/DebugMode";
import { DrawApi } from "./draw_api/DrawApi";
import { CanvasPixels } from "./draw_api/canvas_pixels/CanvasPixels";
import { CanvasPixelsForProduction } from "./draw_api/canvas_pixels/CanvasPixelsForProduction";
import { BpxButtonName } from "./game_input/Buttons";
import { GameInput } from "./game_input/GameInput";
import { GameLoop } from "./game_loop/GameLoop";
import { Logger } from "./logger/Logger";
import { StorageApi } from "./storage/StorageApi";

export type FrameworkOptions = {
  gameCanvasSize: "64x64" | "128x128";
  // TODO: validation it is really one of these two values
  desiredUpdateFps: 30 | 60;
  visibleTouchButtons: BpxButtonName[];
  debugFeatures: boolean;
};

export type OnAssetsLoaded = {
  startGame: () => void;
};

export class Framework {
  // TODO: Move debug responsibility to a separate class
  static readonly #storageDebugDisabledKey = "framework__debug_disabled";
  static readonly #storageDebugDisabledTrue = "yes";

  #frameByFrame: boolean;

  readonly #browserType: BpxBrowserType;

  readonly #gameCanvasSize: BpxVector2d;
  readonly #htmlCanvasBackground: BpxSolidColor =
    BpxSolidColor.fromRgbCssHex("#000000");

  readonly #loading: Loading;
  readonly gameInput: GameInput;
  readonly #gameLoop: GameLoop;
  readonly audioApi: AudioApi;
  readonly #fullScreen: FullScreen;

  readonly storageApi: StorageApi;

  readonly assets: Assets;

  readonly #htmlCanvas: HTMLCanvasElement;
  readonly #canvasPixels: CanvasPixels;
  readonly drawApi: DrawApi;

  #onStarted?: () => void;
  #onUpdate?: () => void;
  #onDraw?: () => void;

  #frameNumber: number = 0;
  #renderFps: number = 1;

  // used to indicate whether the AudioContext resume succeeded. It might have been false for the entire
  #alreadyResumedAudioContext: boolean = false;

  get frameNumber(): number {
    return this.#frameNumber;
  }

  get renderFps(): number {
    return this.#renderFps;
  }

  constructor(options: FrameworkOptions) {
    DebugMode.enabled = options.debugFeatures
      ? window.localStorage.getItem(Framework.#storageDebugDisabledKey) !==
        Framework.#storageDebugDisabledTrue
      : false;

    Logger.debug("Framework options:", options);

    this.#frameByFrame = false;

    this.#browserType = BrowserTypeDetector.detect(navigator.userAgent);

    this.#loading = new Loading(HtmlTemplate.selectors.display);

    this.#gameCanvasSize =
      options.gameCanvasSize === "64x64"
        ? v_(64, 64)
        : options.gameCanvasSize === "128x128"
        ? v_(128, 128)
        : BpxUtils.throwError(
            `Unsupported canvas size: "${options.gameCanvasSize}"`,
          );

    this.gameInput = new GameInput({
      visibleTouchButtons: options.visibleTouchButtons,
      // TODO: are those selectors for both touch and mouse? Even if so, make them separate
      muteButtonsSelector: HtmlTemplate.selectors.controlsMuteToggle,
      // TODO: are those selectors for both touch and mouse? Even if so, make them separate
      fullScreenButtonsSelector: HtmlTemplate.selectors.controlsFullScreen,
      enableDebugInputs: options.debugFeatures,
      browserType: this.#browserType,
    });

    this.#gameLoop = new GameLoop({
      desiredUpdateFps: options.desiredUpdateFps,
      requestAnimationFrameFn: window.requestAnimationFrame.bind(window),
      documentVisibilityStateProvider: document,
    });

    this.storageApi = new StorageApi();

    const audioContext = new AudioContext();

    this.assets = new Assets({
      decodeAudioData: (arrayBuffer: ArrayBuffer) =>
        audioContext.decodeAudioData(arrayBuffer),
    });

    this.audioApi = new AudioApi(this.assets, audioContext);

    this.#fullScreen = FullScreen.newFor(
      HtmlTemplate.selectors.display,
      HtmlTemplate.selectors.controlsFullScreen,
    );

    this.#htmlCanvas =
      document.querySelector<HTMLCanvasElement>(
        HtmlTemplate.selectors.canvas,
      ) ??
      u_.throwError(
        `Was unable to find <canvas> by selector '${HtmlTemplate.selectors.canvas}'`,
      );

    this.#canvasPixels = new CanvasPixelsForProduction(
      this.#gameCanvasSize,
      this.#htmlCanvas,
      this.#htmlCanvasBackground,
    );

    this.drawApi = new DrawApi({
      canvasPixels: this.#canvasPixels,
      assets: this.assets,
    });
  }

  detectedBrowserType(): BpxBrowserType {
    return this.#browserType;
  }

  async loadAssets(assetsToLoad: AssetsToLoad): Promise<OnAssetsLoaded> {
    return this.assets.loadAssets(assetsToLoad).then(() => {
      Logger.infoBeetPx("initialized");
      return {
        startGame: this.#startGame.bind(this),
      };
    });
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
    this.#frameNumber = 0;

    this.audioApi.restart();

    BeetPx.clearCanvas(black_);

    this.#onStarted?.();
  }

  // TODO: How to prevent an error of calling startGame twice? What would happen if called twice?
  #startGame(): void {
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

    this.#canvasPixels.onWindowResize();
    window.addEventListener("resize", (_event) => {
      this.#canvasPixels.onWindowResize();
    });

    this.#frameNumber = 0;

    this.#onStarted?.();

    this.#loading.showApp();

    this.gameInput.startListening();

    this.#gameLoop.start({
      updateFn: () => {
        if (this.gameInput.buttonFullScreen.wasJustPressed(false)) {
          this.#fullScreen.toggle();
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
          if (DebugMode.enabled) {
            window.localStorage.removeItem(Framework.#storageDebugDisabledKey);
          } else {
            window.localStorage.setItem(
              Framework.#storageDebugDisabledKey,
              Framework.#storageDebugDisabledTrue,
            );
          }
          // TODO: BRING IT BACK
          // this.#redrawDebugMargin();
        }
        if (this.gameInput.buttonFrameByFrameToggle.wasJustPressed(false)) {
          this.#frameByFrame = !this.#frameByFrame;
          Logger.infoBeetPx(`FrameByFrame mode set to: ${this.#frameByFrame}`);
        }

        const shouldUpdate =
          !this.#frameByFrame ||
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
          if (this.#frameByFrame) {
            Logger.infoBeetPx(
              `Running onUpdate for frame: ${this.#frameNumber}`,
            );
          }

          this.#onUpdate?.();

          this.#frameNumber =
            this.#frameNumber >= Number.MAX_SAFE_INTEGER
              ? 0
              : this.#frameNumber + 1;
        }
      },
      renderFn: (renderFps) => {
        this.#renderFps = renderFps;

        this.#onDraw?.();

        this.#render();
      },
    });
  }

  #render(): void {
    this.drawApi.processQueuedCommands();

    this.#drawDebugMargin();

    this.#canvasPixels.render();
  }

  #drawDebugMargin(): void {
    if (DebugMode.enabled) {
      this.#htmlCanvas.classList.add(HtmlTemplate.classes.canvasDebugBorder);
    } else {
      this.#htmlCanvas.classList.remove(HtmlTemplate.classes.canvasDebugBorder);
    }
  }
}
