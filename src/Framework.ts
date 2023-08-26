import { Assets, AssetsToLoad } from "./Assets";
import { AudioApi } from "./audio/AudioApi";
import { SolidColor } from "./Color";
import { DebugMode } from "./debug/DebugMode";
import { DrawApi } from "./draw_api/DrawApi";
import { FullScreen } from "./FullScreen";
import { ButtonName } from "./game_input/Buttons";
import { GameInput } from "./game_input/GameInput";
import { GameLoop } from "./game_loop/GameLoop";
import { Loading } from "./Loading";
import { Logger } from "./logger/Logger";
import { StorageApi } from "./storage/StorageApi";
import { Utils } from "./Utils";
import { v_, Vector2d } from "./Vector2d";

export type FrameworkOptions = {
  gameCanvasSize: "64x64" | "128x128";
  desiredFps: number;
  visibleTouchButtons: ButtonName[];
  // TODO: Does is still work?
  logActualFps?: boolean;
  debug?: {
    available: boolean;
    /**
     * A key to toggle debug mode on/off. Has to match a
     * [KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
     * of a desired key.
     */
    toggleKey?: string;
    frameByFrame?: {
      activateKey?: string;
      stepKey?: string;
    };
  };
};

export type OnAssetsLoaded = {
  startGame: () => void;
};

export class Framework {
  // TODO: Move debug responsibility to a separate class
  static readonly #storageDebugDisabledKey = "framework__debug_disabled";
  static readonly #storageDebugDisabledTrue = "yes";

  readonly #htmlDisplaySelector = "#display";
  readonly #htmlCanvasSelector = "#canvas";
  readonly #htmlControlsFullscreenSelector = ".controls_fullscreen_toggle";
  readonly #htmlControlsMuteSelector = ".controls_mute_toggle";

  readonly #debugOptions: FrameworkOptions["debug"];
  #frameByFrame: boolean;

  readonly #gameCanvasSize: Vector2d;
  readonly #htmlCanvasBackground: SolidColor =
    SolidColor.fromRgbCssHex("#000000");

  readonly #htmlCanvasContext: CanvasRenderingContext2D;
  readonly #offscreenContext: OffscreenCanvasRenderingContext2D;
  readonly #offscreenImageData: ImageData;

  readonly #loading: Loading;
  readonly gameInput: GameInput;
  readonly #gameLoop: GameLoop;
  readonly audioApi: AudioApi;
  readonly #fullScreen: FullScreen;

  readonly storageApi: StorageApi;

  readonly assets: Assets;

  readonly drawApi: DrawApi;

  #onStarted?: () => void;
  #onUpdate?: () => void;
  #onDraw?: () => void;

  #scaleToFill = 1;
  #centeringOffset = Vector2d.zero;

  #frameNumber: number = 0;
  #millisSinceStarted: number = 0;
  #millisSinceLastUpdate: number = 0;
  averageFps: number = 1;

  get frameNumber(): number {
    return this.#frameNumber;
  }

  get t(): number {
    return this.#millisSinceStarted / 1000;
  }

  get dt(): number {
    return this.#millisSinceLastUpdate / 1000;
  }

  constructor(options: FrameworkOptions) {
    this.#debugOptions = options.debug ?? {
      available: false,
    };
    DebugMode.enabled = this.#debugOptions?.available
      ? window.localStorage.getItem(Framework.#storageDebugDisabledKey) !==
        Framework.#storageDebugDisabledTrue
      : false;
    this.#frameByFrame = false;

    this.#loading = new Loading(this.#htmlDisplaySelector);

    this.#gameCanvasSize =
      options.gameCanvasSize === "64x64"
        ? v_(64, 64)
        : options.gameCanvasSize === "128x128"
        ? v_(128, 128)
        : Utils.throwError(
            `Unsupported canvas size: "${options.gameCanvasSize}"`,
          );

    const htmlCanvas = document.querySelector<HTMLCanvasElement>(
      this.#htmlCanvasSelector,
    );
    if (!htmlCanvas) {
      throw Error(
        `Was unable to find <canvas> by selector '${this.#htmlCanvasSelector}'`,
      );
    }

    const htmlCanvasContext = htmlCanvas.getContext("2d", {
      // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#turn_off_transparency
      alpha: false,
    });
    if (!htmlCanvasContext) {
      throw Error("Was unable to obtain <canvas>' 2D context");
    }
    this.#htmlCanvasContext = htmlCanvasContext;

    const offscreenCanvas = document
      .createElement("canvas")
      .transferControlToOffscreen();
    offscreenCanvas.width = this.#gameCanvasSize.x;
    offscreenCanvas.height = this.#gameCanvasSize.y;
    const offscreenContext = offscreenCanvas.getContext("2d", {
      // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#turn_off_transparency
      alpha: false,
    });
    if (!offscreenContext) {
      throw Error("Was unable to obtain OffscreenCanvas' 2D context");
    }
    this.#offscreenContext = offscreenContext;

    this.gameInput = new GameInput({
      visibleTouchButtons: options.visibleTouchButtons,
      // TODO: are those selectors for both touch and mouse? Even if so, make them separate
      muteButtonsSelector: this.#htmlControlsMuteSelector,
      // TODO: are those selectors for both touch and mouse? Even if so, make them separate
      fullScreenButtonsSelector: this.#htmlControlsFullscreenSelector,
      // TODO: extract ";", ",", and "." to some file about debugging
      debugToggleKey: this.#debugOptions?.available
        ? this.#debugOptions?.toggleKey ?? ";"
        : undefined,
      debugFrameByFrameActivateKey: this.#debugOptions?.available
        ? this.#debugOptions.frameByFrame?.activateKey ?? ","
        : undefined,
      debugFrameByFrameStepKey: this.#debugOptions?.available
        ? this.#debugOptions.frameByFrame?.stepKey ?? "."
        : undefined,
    });

    this.#gameLoop = new GameLoop({
      desiredFps: options.desiredFps,
      logActualFps: options.logActualFps ?? false,
      requestAnimationFrameFn: window.requestAnimationFrame.bind(window),
    });

    this.storageApi = new StorageApi();

    const audioContext = new AudioContext();

    this.assets = new Assets({
      decodeAudioData: (arrayBuffer: ArrayBuffer) =>
        audioContext.decodeAudioData(arrayBuffer),
    });

    this.audioApi = new AudioApi(this.assets, audioContext);

    this.#fullScreen = FullScreen.newFor(
      this.#htmlDisplaySelector,
      this.#htmlControlsFullscreenSelector,
    );

    this.#offscreenImageData = this.#offscreenContext.createImageData(
      this.#offscreenContext.canvas.width,
      this.#offscreenContext.canvas.height,
    );
    this.drawApi = new DrawApi({
      canvasBytes: this.#offscreenImageData.data,
      canvasSize: this.#gameCanvasSize,
      assets: this.assets,
    });
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
    this.#millisSinceStarted = 0;
    this.#millisSinceLastUpdate = 0;

    this.#onStarted?.();
  }

  // TODO: How to prevent an error of calling startGame twice? What would happen if called twice?
  #startGame(): void {
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

    this.#setupHtmlCanvas();
    window.addEventListener("resize", (_event) => {
      this.#setupHtmlCanvas();
    });

    this.#frameNumber = 0;
    this.#millisSinceStarted = 0;
    this.#millisSinceLastUpdate = 0;

    this.#onStarted?.();

    this.#loading.showApp();

    this.gameInput.startListening();

    this.#gameLoop.start({
      updateFn: (averageFps, deltaMillis) => {
        if (this.gameInput.buttonFullScreen.wasJustPressed(false)) {
          this.#fullScreen.toggle();
        }
        if (this.gameInput.buttonMuteUnmute.wasJustPressed(false)) {
          this.audioApi.toggleMuteUnmute();
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
          this.#redrawDebugMargin();
        }
        if (this.gameInput.buttonFrameByFrameToggle.wasJustPressed(false)) {
          this.#frameByFrame = !this.#frameByFrame;
          Logger.infoBeetPx(`FrameByFrame mode set to: ${this.#frameByFrame}`);
        }

        if (this.gameInput.wasAnyButtonPressed()) {
          this.audioApi.resumeAudioContextIfNeeded();
        }

        this.averageFps = averageFps;

        const shouldUpdate =
          !this.#frameByFrame ||
          this.gameInput.buttonFrameByFrameStep.wasJustPressed(false);

        this.gameInput.update({ skipGameButtons: !shouldUpdate });

        if (shouldUpdate) {
          if (this.#frameByFrame) {
            Logger.infoBeetPx(
              `Running onUpdate for frame=${
                this.#frameNumber
              } with dt=${deltaMillis.toFixed(0)}ms`,
            );
          }

          this.#onUpdate?.();

          this.#frameNumber =
            this.#frameNumber >= Number.MAX_SAFE_INTEGER
              ? 0
              : this.#frameNumber + 1;

          this.#millisSinceStarted =
            this.#millisSinceStarted === Number.MAX_SAFE_INTEGER
              ? 0
              : this.#millisSinceStarted + deltaMillis;

          this.#millisSinceLastUpdate = deltaMillis;
        }
      },
      renderFn: () => {
        this.#onDraw?.();
        this.#render();
      },
    });
  }

  // This function assumes that <canvas> has width and height set to 100% by CSS.
  #setupHtmlCanvas(): void {
    // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_for_high_resolution_displays
    this.#htmlCanvasContext.canvas.width =
      this.#htmlCanvasContext.canvas.getBoundingClientRect().width *
      window.devicePixelRatio;
    this.#htmlCanvasContext.canvas.height =
      this.#htmlCanvasContext.canvas.getBoundingClientRect().height *
      window.devicePixelRatio;

    this.#htmlCanvasContext.imageSmoothingEnabled = false;

    this.#htmlCanvasContext.fillStyle =
      this.#htmlCanvasBackground.asRgbCssHex();
    this.#htmlCanvasContext.fillRect(
      0,
      0,
      this.#htmlCanvasContext.canvas.width,
      this.#htmlCanvasContext.canvas.height,
    );
  }

  #render(): void {
    this.#offscreenContext.putImageData(this.#offscreenImageData, 0, 0);

    const htmlCanvasSize = v_(
      this.#htmlCanvasContext.canvas.width,
      this.#htmlCanvasContext.canvas.height,
    );
    // TODO: encapsulate this calculation and related fields
    this.#scaleToFill = Math.min(
      htmlCanvasSize.div(this.#gameCanvasSize).floor().x,
      htmlCanvasSize.div(this.#gameCanvasSize).floor().y,
    );
    this.#centeringOffset = htmlCanvasSize
      .sub(this.#gameCanvasSize.mul(this.#scaleToFill))
      .div(2)
      .floor();

    this.#redrawDebugMargin();

    this.#htmlCanvasContext.drawImage(
      this.#offscreenContext.canvas,
      0,
      0,
      this.#offscreenContext.canvas.width,
      this.#offscreenContext.canvas.height,
      this.#centeringOffset.x,
      this.#centeringOffset.y,
      this.#scaleToFill * this.#gameCanvasSize.x,
      this.#scaleToFill * this.#gameCanvasSize.y,
    );
  }

  #redrawDebugMargin(): void {
    const debugBgMargin = 1;
    this.#htmlCanvasContext.fillStyle = DebugMode.enabled
      ? "#ff0000"
      : this.#htmlCanvasBackground.asRgbCssHex();
    this.#htmlCanvasContext.fillRect(
      this.#centeringOffset.x - debugBgMargin,
      this.#centeringOffset.y - debugBgMargin,
      this.#scaleToFill * this.#gameCanvasSize.x + 2 * debugBgMargin,
      this.#scaleToFill * this.#gameCanvasSize.y + 2 * debugBgMargin,
    );
  }
}
