import { Assets, AssetsToLoad } from "./Assets";
import { Audio } from "./audio/Audio";
import { SolidColor } from "./Color";
import { DrawApi } from "./draw_api/DrawApi";
import { FullScreen } from "./FullScreen";
import { GameInput } from "./game_input/GameInput";
import { GameLoop } from "./game_loop/GameLoop";
import { Loading } from "./Loading";
import { BeetPx } from "./BeetPx";
import { StorageApi } from "./StorageApi";
import { Xy, xy_ } from "./Xy";

export type FrameworkOptions = {
  htmlCanvasBackground: SolidColor;
  gameCanvasSize: Xy;
  desiredFps: number;
  logActualFps?: boolean;
  debug?: {
    enabledOnInit: boolean;
    /**
     * A key to toggle debug mode on/off. Has to match a
     * [KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
     * of a desired key.
     */
    toggleKey?: string;
  };
};

export class Framework {
  readonly #htmlDisplaySelector = "#display";
  readonly #htmlCanvasSelector = "#canvas";
  readonly #htmlControlsFullscreenSelector = ".controls_fullscreen_toggle";
  readonly #htmlControlsMuteSelector = ".controls_mute_toggle";

  readonly #debugOptions: FrameworkOptions["debug"];
  #debug: boolean;
  get debug(): boolean {
    return this.#debug;
  }

  readonly #gameCanvasSize: Xy;
  readonly #htmlCanvasBackground: SolidColor;

  readonly #htmlCanvasContext: CanvasRenderingContext2D;
  readonly #offscreenContext: OffscreenCanvasRenderingContext2D;
  readonly #offscreenImageData: ImageData;

  readonly #loading: Loading;
  readonly #gameInput: GameInput;
  readonly #gameLoop: GameLoop;
  readonly #audio: Audio;
  readonly #fullScreen: FullScreen;

  readonly #assets: Assets;

  readonly #drawApi: DrawApi;
  readonly #storageApi: StorageApi;

  #onUpdate?: () => void;
  #onDraw?: () => void;

  #scaleToFill = 1;
  #centeringOffset = Xy.zero;

  constructor(options: FrameworkOptions) {
    this.#debugOptions = options.debug ?? {
      enabledOnInit: false,
    };
    this.#debug = this.#debugOptions?.enabledOnInit;

    this.#loading = new Loading(this.#htmlDisplaySelector);

    this.#gameCanvasSize = options.gameCanvasSize.floor();
    this.#htmlCanvasBackground = options.htmlCanvasBackground;

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
    offscreenCanvas.width = options.gameCanvasSize.x;
    offscreenCanvas.height = options.gameCanvasSize.y;
    const offscreenContext = offscreenCanvas.getContext("2d", {
      // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#turn_off_transparency
      alpha: false,
    });
    if (!offscreenContext) {
      throw Error("Was unable to obtain OffscreenCanvas' 2D context");
    }
    this.#offscreenContext = offscreenContext;

    this.#gameInput = new GameInput({
      muteButtonsSelector: this.#htmlControlsMuteSelector,
      fullScreenButtonsSelector: this.#htmlControlsFullscreenSelector,
      debugToggleKey: this.#debugOptions?.toggleKey,
    });

    this.#gameLoop = new GameLoop({
      desiredFps: options.desiredFps,
      logActualFps: options.logActualFps ?? false,
      requestAnimationFrameFn: window.requestAnimationFrame.bind(window),
    });

    const audioContext = new AudioContext();

    this.#assets = new Assets({
      decodeAudioData: (arrayBuffer: ArrayBuffer) =>
        audioContext.decodeAudioData(arrayBuffer),
    });

    this.#audio = new Audio(this.#assets, audioContext);

    this.#fullScreen = FullScreen.newFor(
      this.#htmlDisplaySelector,
      this.#htmlControlsFullscreenSelector,
    );

    this.#offscreenImageData = this.#offscreenContext.createImageData(
      this.#offscreenContext.canvas.width,
      this.#offscreenContext.canvas.height,
    );
    this.#drawApi = new DrawApi({
      canvasBytes: this.#offscreenImageData.data,
      canvasSize: this.#gameCanvasSize,
      assets: this.#assets,
    });

    this.#storageApi = new StorageApi();

    BeetPx.drawApi = this.#drawApi;
    BeetPx.audio = this.#audio;
    BeetPx.storageApi = this.#storageApi;
  }

  // TODO: type the startGame fn or the entire object inside resolved Promise
  loadAssets(
    assetsToLoad: AssetsToLoad,
  ): Promise<{ startGame: (onStart?: () => void) => void }> {
    return this.#assets.loadAssets(assetsToLoad).then(() => ({
      startGame: this.#startGame.bind(this),
    }));
  }

  setOnUpdate(onUpdate: () => void) {
    this.#onUpdate = onUpdate;
  }

  setOnDraw(onDraw: () => void) {
    this.#onDraw = onDraw;
  }

  // TODO: How to prevent an error of calling startGame twice? What would happen if called twice?
  #startGame(onStart?: () => void): void {
    this.#setupHtmlCanvas();
    window.addEventListener("resize", (_event) => {
      this.#setupHtmlCanvas();
    });

    // TODO: rename to make it clear this will happen before the game loop starts and game gets rendered
    onStart?.();

    this.#loading.showApp();

    this.#gameInput.startListening();

    this.#gameLoop.start({
      updateFn: (frameNumber) => {
        const fireOnceEvents = this.#gameInput.consumeFireOnceEvents();
        if (fireOnceEvents.has("full_screen")) {
          this.#fullScreen.toggle();
        }
        if (fireOnceEvents.has("mute_unmute_toggle")) {
          this.#audio.toggleMuteUnmute();
        }
        if (fireOnceEvents.has("debug_toggle")) {
          this.#debug = !this.#debug;
          this.#redrawDebugMargin();
        }

        const continuousEvents = this.#gameInput.getCurrentContinuousEvents();

        if (fireOnceEvents.size > 0 || continuousEvents.size > 0) {
          this.#audio.resumeAudioContextIfNeeded();
        }

        BeetPx.frameNumber = frameNumber;
        BeetPx.continuousInputEvents = continuousEvents;
        BeetPx.fireOnceInputEvents = fireOnceEvents;

        this.#onUpdate?.();
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

    const htmlCanvasSize = xy_(
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
    this.#htmlCanvasContext.fillStyle = this.#debug
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
