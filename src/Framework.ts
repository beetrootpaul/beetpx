import { BeetPx } from "./BeetPx";
import { HtmlTemplate } from "./HtmlTemplate";
import { BpxUtils, u_ } from "./Utils";
import { AssetLoader, AssetsToLoad } from "./assets/AssetLoader";
import { Assets } from "./assets/Assets";
import { AudioApi } from "./audio/AudioApi";
import {
  BpxBrowserType,
  BrowserTypeDetector,
} from "./browser/BrowserTypeDetector";
import { Canvas } from "./canvas/Canvas";
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
import { BpxVector2d, v_ } from "./misc/Vector2d";
import { StorageApi } from "./storage/StorageApi";

export type FrameworkOptions = {
  gameCanvasSize: "64x64" | "128x128" | "256x256";
  desiredUpdateFps: 30 | 60;
  debugFeatures: boolean;
};

export type OnAssetsLoaded = {
  startGame: () => Promise<void>;
};

export class Framework {
  static readonly #storageDebugDisabledKey = "framework__debug_disabled";
  static readonly #storageDebugDisabledTrue = "yes";

  #frameByFrame: boolean;

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

  #isStarted: boolean = false;

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
    window.addEventListener("error", (event) => {
      HtmlTemplate.showError(event.message);
      // Pause music. But do it after other operations, since there
      //   might be some new unexpected an error thrown here.
      this.audioApi
        ?.__internal__audioContext()
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
        ?.__internal__audioContext()
        .suspend()
        .then(() => {});
    });

    DebugMode.enabled = options.debugFeatures
      ? window.localStorage.getItem(Framework.#storageDebugDisabledKey) !==
        Framework.#storageDebugDisabledTrue
      : false;

    Logger.debugBeetPx("Framework options:", options);

    if (options.desiredUpdateFps !== 30 && options.desiredUpdateFps !== 60) {
      BpxUtils.throwError(
        `Unsupported desiredUpdateFps: ${options.desiredUpdateFps}`,
      );
    }

    Button.setRepeatingParamsFor(options.desiredUpdateFps);

    this.#frameByFrame = false;

    this.#browserType = BrowserTypeDetector.detect(navigator.userAgent);

    this.#gameCanvasSize =
      options.gameCanvasSize === "64x64"
        ? v_(64, 64)
        : options.gameCanvasSize === "128x128"
          ? v_(128, 128)
          : options.gameCanvasSize === "256x256"
            ? v_(256, 256)
            : BpxUtils.throwError(
                `Unsupported canvas size: "${options.gameCanvasSize}"`,
              );

    this.gameInput = new GameInput({
      enableDebugInputs: options.debugFeatures,
      browserType: this.#browserType,
    });

    this.#gameLoop = new GameLoop({
      desiredUpdateFps: options.desiredUpdateFps,
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
      u_.throwError(
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
  }

  detectedBrowserType(): BpxBrowserType {
    return this.#browserType;
  }

  async init(assetsToLoad: AssetsToLoad): Promise<OnAssetsLoaded> {
    assetsToLoad.fonts.push({
      font: new BpxFontSaint11Minimal4(),
      spriteTextColor: null,
    });
    assetsToLoad.fonts.push({
      font: new BpxFontSaint11Minimal5(),
      spriteTextColor: null,
    });
    await this.#assetLoader.loadAssets(assetsToLoad);

    Logger.infoBeetPx(`BeetPx ${BEETPX__VERSION} initialized`);

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
    this.#frameNumber = 0;

    this.audioApi.restart();

    BeetPx.clearCanvas(black_);

    this.#onStarted?.();
  }

  async #startGame(): Promise<void> {
    if (this.#isStarted) {
      throw Error("Tried to start a game, but it is already started");
    }
    this.#isStarted = true;

    if (BEETPX__IS_PROD) {
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

    this.#frameNumber = 0;

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
          if (DebugMode.enabled) {
            window.localStorage.removeItem(Framework.#storageDebugDisabledKey);
          } else {
            window.localStorage.setItem(
              Framework.#storageDebugDisabledKey,
              Framework.#storageDebugDisabledTrue,
            );
          }
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

        this.#canvas.render();
      },
    });
  }
}
