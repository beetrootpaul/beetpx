// noinspection JSUnusedGlobalSymbols

import { Engine, type BpxEngineConfig } from "./Engine";
import { Assets } from "./assets/Assets";
import { AudioApi } from "./audio/AudioApi";
import { BpxBrowserType } from "./browser/BrowserTypeDetector";
import { BpxCanvasSnapshotColorMapping } from "./color/CanvasSnapshotColorMapping";
import { BpxPatternColors } from "./color/PatternColors";
import { BpxRgbColor } from "./color/RgbColor";
import { BpxSpriteColorMapping } from "./color/SpriteColorMapping";
import { DebugMode } from "./debug/DebugMode";
import { BpxDrawingPattern } from "./draw_api/DrawingPattern";
import { BpxPixels } from "./draw_api/Pixels";
import { BpxFont, BpxTextColorMarkers } from "./font/Font";
import { GameInput } from "./game_input/GameInput";
import { GameButtons } from "./game_input/buttons/GameButtons";
import { Logger } from "./logger/Logger";
import { FullScreen } from "./misc/FullScreen";
import { BpxVector2d } from "./misc/Vector2d";
import { GlobalPause } from "./pause/GlobalPause";
import { BpxAnimatedSprite } from "./sprite/AnimatedSprite";
import { BpxSprite } from "./sprite/Sprite";
import { StorageApi } from "./storage/StorageApi";
import { assertUnreachable } from "./utils/assertUnreachable";
import { booleanChangingEveryNthFrame } from "./utils/booleanChangingEveryNthFrame";
import { clamp } from "./utils/clamp";
import { drawTextWithOutline } from "./utils/drawTextWithOutline";
import { identity } from "./utils/identity";
import { isDefined } from "./utils/isDefined";
import { lerp } from "./utils/lerp";
import { mod } from "./utils/mod";
import { noop } from "./utils/noop";
import { offset4Directions } from "./utils/offset4Directions";
import { offset8Directions } from "./utils/offset8Directions";
import { randomElementOf } from "./utils/randomElementOf";
import { range } from "./utils/range";
import { repeatEachElement } from "./utils/repeatEachElement";
import { throwError } from "./utils/throwError";
import { trigAtan2 } from "./utils/trigAtan2";
import { trigCos } from "./utils/trigCos";
import { trigSin } from "./utils/trigSin";
import { wait } from "./utils/wait";

/////////////////////////////////////////////////////////////////////////////

export class BeetPx {
  static #engine: Engine;

  //
  // The most important function, _has to be called first_ in order to properly initialize other fields and variables.
  //

  static async init(config?: BpxEngineConfig): ReturnType<Engine["init"]> {
    Logger.infoBeetPx(`BeetPx ${window.BEETPX__VERSION} : Initializing…`);
    this.#engine = new Engine(config);
    const { startGame } = await this.#engine.init();
    Logger.infoBeetPx(`BeetPx ${window.BEETPX__VERSION} : Initialized`);
    return { startGame };
  }

  static get debug(): typeof DebugMode.enabled {
    return DebugMode.enabled;
  }

  static get canvasSize(): BpxVector2d {
    return this.#tryGetEngine().canvasSize;
  }

  /**
   * Number of frames processed since game started.
   * It gets reset to 0 when `BeetPx.restart()` is called.
   * It counts update calls, not draw calls.
   *
   * @return number
   */
  static get frameNumber(): number {
    return this.#tryGetEngine().frameNumber;
  }

  static get frameNumberOutsidePause(): number {
    return this.#tryGetEngine().frameNumberOutsidePause;
  }

  static get renderingFps(): number {
    return this.#tryGetEngine().renderingFps;
  }

  static get detectedBrowserType(): BpxBrowserType {
    return this.#tryGetEngine().detectedBrowserType;
  }

  //
  // lifecycle methods
  //

  static setOnStarted: Engine["setOnStarted"] = (...args) => {
    return this.#tryGetEngine().setOnStarted(...args);
  };

  static setOnUpdate: Engine["setOnUpdate"] = (...args) => {
    return this.#tryGetEngine().setOnUpdate(...args);
  };

  static setOnDraw: Engine["setOnDraw"] = (...args) => {
    return this.#tryGetEngine().setOnDraw(...args);
  };

  static restart: Engine["restart"] = (...args) => {
    return this.#tryGetEngine().restart(...args);
  };

  //
  // Logger
  //

  static logDebug: typeof Logger.debug = (...args) => {
    return Logger.debug(...args);
  };

  static logInfo: typeof Logger.info = (...args) => {
    return Logger.info(...args);
  };

  static logWarn: typeof Logger.warn = (...args) => {
    return Logger.warn(...args);
  };

  static logError: typeof Logger.error = (...args) => {
    return Logger.error(...args);
  };

  //
  // Global Pause
  //

  static get isPaused(): boolean {
    return GlobalPause.isActive;
  }

  static get wasJustPaused(): boolean {
    return GlobalPause.wasJustActivated;
  }

  static get wasJustResumed(): boolean {
    return GlobalPause.wasJustDeactivated;
  }

  static pause(): void {
    GlobalPause.activate();
  }

  static resume(): void {
    GlobalPause.deactivate();
  }

  //
  // Game Input & Buttons
  //

  static wasAnyButtonJustPressed: GameButtons["wasAnyJustPressed"] = (
    ...args
  ) => {
    return this.#tryGetEngine().gameInput.gameButtons.wasAnyJustPressed(
      ...args,
    );
  };

  static wasButtonJustPressed: GameButtons["wasJustPressed"] = (...args) => {
    return this.#tryGetEngine().gameInput.gameButtons.wasJustPressed(...args);
  };

  static wasButtonJustReleased: GameButtons["wasJustReleased"] = (...args) => {
    return this.#tryGetEngine().gameInput.gameButtons.wasJustReleased(...args);
  };

  static isAnyButtonPressed: GameButtons["isAnyPressed"] = (...args) => {
    return this.#tryGetEngine().gameInput.gameButtons.isAnyPressed(...args);
  };

  static isButtonPressed: GameButtons["isPressed"] = (...args) => {
    return this.#tryGetEngine().gameInput.gameButtons.isPressed(...args);
  };

  static getPressedDirection: GameButtons["getPressedDirection"] = (
    ...args
  ) => {
    return this.#tryGetEngine().gameInput.gameButtons.getPressedDirection(
      ...args,
    );
  };

  static setButtonRepeating: GameButtons["setButtonRepeating"] = (...args) => {
    return this.#tryGetEngine().gameInput.gameButtons.setButtonRepeating(
      ...args,
    );
  };

  static getRecentInputMethods: GameInput["getRecentInputMethods"] = (
    ...args
  ) => {
    return this.#tryGetEngine().gameInput.getRecentInputMethods(...args);
  };

  static getConnectedGamepadTypes: GameInput["getConnectedGamepadTypes"] = (
    ...args
  ) => {
    return this.#tryGetEngine().gameInput.getConnectedGamepadTypes(...args);
  };

  static getEventsCapturedInLastUpdate: GameInput["getEventsCapturedInLastUpdate"] =
    (...args) => {
      return this.#tryGetEngine().gameInput.getEventsCapturedInLastUpdate(
        ...args,
      );
    };

  //
  // Audio API
  //

  static isAudioMuted: AudioApi["isAudioMuted"] = (...args) => {
    return this.#tryGetEngine().audioApi.isAudioMuted(...args);
  };

  static muteAudio: AudioApi["muteAudio"] = (...args) => {
    return this.#tryGetEngine().audioApi.muteAudio(...args);
  };

  static unmuteAudio: AudioApi["unmuteAudio"] = (...args) => {
    return this.#tryGetEngine().audioApi.unmuteAudio(...args);
  };

  static startPlayback: AudioApi["startPlayback"] = (...args) => {
    return this.#tryGetEngine().audioApi.startPlayback(...args);
  };

  static startPlaybackLooped: AudioApi["startPlaybackLooped"] = (...args) => {
    return this.#tryGetEngine().audioApi.startPlaybackLooped(...args);
  };

  static startPlaybackSequence: AudioApi["startPlaybackSequence"] = (
    ...args
  ) => {
    return this.#tryGetEngine().audioApi.startPlaybackSequence(...args);
  };

  static mutePlayback: AudioApi["mutePlayback"] = (...args) => {
    return this.#tryGetEngine().audioApi.mutePlayback(...args);
  };

  static unmutePlayback: AudioApi["unmutePlayback"] = (...args) => {
    return this.#tryGetEngine().audioApi.unmutePlayback(...args);
  };

  static stopPlayback: AudioApi["stopPlayback"] = (...args) => {
    return this.#tryGetEngine().audioApi.stopPlayback(...args);
  };

  static pausePlayback: AudioApi["pausePlayback"] = (...args) => {
    return this.#tryGetEngine().audioApi.pausePlayback(...args);
  };

  static resumePlayback: AudioApi["resumePlayback"] = (...args) => {
    return this.#tryGetEngine().audioApi.resumePlayback(...args);
  };

  static getAudioContext: AudioApi["getAudioContext"] = (...args) => {
    return this.#tryGetEngine().audioApi.getAudioContext(...args);
  };

  //
  // Full Screen
  //

  static isFullScreenSupported: FullScreen["isFullScreenSupported"] = (
    ...args
  ) => {
    return this.#tryGetEngine().fullScreen.isFullScreenSupported(...args);
  };

  static isInFullScreen: FullScreen["isInFullScreen"] = (...args) => {
    return this.#tryGetEngine().fullScreen.isInFullScreen(...args);
  };

  static toggleFullScreen: FullScreen["toggleFullScreen"] = (...args) => {
    return this.#tryGetEngine().fullScreen.toggleFullScreen(...args);
  };

  //
  // Storage API
  //

  static savePersistedState: StorageApi["savePersistedState"] = (...args) => {
    return this.#tryGetEngine().storageApi.savePersistedState(...args);
  };

  static loadPersistedState: StorageApi["loadPersistedState"] = (...args) => {
    return this.#tryGetEngine().storageApi.loadPersistedState(...args);
  };

  static clearPersistedState: StorageApi["clearPersistedState"] = (...args) => {
    return this.#tryGetEngine().storageApi.clearPersistedState(...args);
  };

  //
  // Direct access to loaded assets
  //

  static getImageAsset: Assets["getImageAsset"] = (...args) => {
    return this.#tryGetEngine().assets.getImageAsset(...args);
  };

  static getSoundAsset: Assets["getSoundAsset"] = (...args) => {
    return this.#tryGetEngine().assets.getSoundAsset(...args);
  };

  static getJsonAsset: Assets["getJsonAsset"] = (...args) => {
    return this.#tryGetEngine().assets.getJsonAsset(...args);
  };

  //
  // private helpers
  //

  static #tryGetEngine(drawFnNameToLogIfOutsideDrawCallback?: string): Engine {
    if (!this.#engine) {
      throw Error(
        `Tried to access BeetPx API without calling BeetPx.init(…) first.`,
      );
    }
    if (
      drawFnNameToLogIfOutsideDrawCallback &&
      !this.#engine.isInsideDrawOrStartedCallback
    ) {
      Logger.warnBeetPx(
        `Used "${drawFnNameToLogIfOutsideDrawCallback}" outside of either "setOnDraw" or "setOnStarted" callback.`,
      );
    }
    return this.#engine;
  }

  //
  // Draw API
  //

  static draw = {
    clearCanvas(color: BpxRgbColor): void {
      BeetPx.#tryGetEngine("clearCanvas").drawApi.clearCanvas(color);
    },

    /**
     * @returns - previous clipping region in form of an array: [xy, wh]
     */
    setClippingRegion(
      xy: BpxVector2d,
      wh: BpxVector2d,
    ): [xy: BpxVector2d, wh: BpxVector2d] {
      return BeetPx.#tryGetEngine(
        "setClippingRegion",
      ).drawApi.setClippingRegion(xy, wh);
    },

    /**
     * @returns - previous clipping region in form of an array: [xy, wh]
     */
    removeClippingRegion(): [xy: BpxVector2d, wh: BpxVector2d] {
      return BeetPx.#tryGetEngine(
        "removeClippingRegion",
      ).drawApi.removeClippingRegion();
    },

    /**
     * Sets a new XY (left-top corner) of a camera's viewport
     *
     * @returns previous camera XY
     */
    setCameraXy(xy: BpxVector2d): BpxVector2d {
      return BeetPx.#tryGetEngine("setCameraXy").drawApi.setCameraXy(xy);
    },

    /**
     * @returns previous pattern
     */
    setDrawingPattern(pattern: BpxDrawingPattern): BpxDrawingPattern {
      return BeetPx.#tryGetEngine(
        "setDrawingPattern",
      ).drawApi.setDrawingPattern(pattern);
    },

    pixel(xy: BpxVector2d, color: BpxRgbColor): void {
      BeetPx.#tryGetEngine("pixel").drawApi.drawPixel(xy, color);
    },

    /**
     * Draws pixels based on a visual 2d representation in form of rows
     *   (designated by new lines) where `#` and `-` stand for a colored
     *   pixel and a lack of a pixel. Whitespaces are ignored.
     */
    pixels(
      pixels: BpxPixels,
      xy: BpxVector2d,
      color: BpxRgbColor,
      opts?: {
        centerXy?: [boolean, boolean];
        scaleXy?: BpxVector2d;
        flipXy?: [boolean, boolean];
      },
    ): void {
      BeetPx.#tryGetEngine("pixels").drawApi.drawPixels(
        pixels,
        xy,
        color,
        opts,
      );
    },

    line(
      xy: BpxVector2d,
      wh: BpxVector2d,
      color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
    ): void {
      BeetPx.#tryGetEngine("line").drawApi.drawLine(xy, wh, color);
    },

    rect(
      xy: BpxVector2d,
      wh: BpxVector2d,
      color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
    ): void {
      BeetPx.#tryGetEngine("rect").drawApi.drawRect(xy, wh, color);
    },

    rectFilled(
      xy: BpxVector2d,
      wh: BpxVector2d,
      color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
    ): void {
      BeetPx.#tryGetEngine("rectFilled").drawApi.drawRectFilled(xy, wh, color);
    },

    rectOutsideFilled(
      xy: BpxVector2d,
      wh: BpxVector2d,
      color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
    ): void {
      BeetPx.#tryGetEngine("rectOutsideFilled").drawApi.drawRectOutsideFilled(
        xy,
        wh,
        color,
      );
    },

    ellipse(
      xy: BpxVector2d,
      wh: BpxVector2d,
      color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
    ): void {
      BeetPx.#tryGetEngine("ellipse").drawApi.drawEllipse(xy, wh, color);
    },

    ellipseFilled(
      xy: BpxVector2d,
      wh: BpxVector2d,
      color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
    ): void {
      BeetPx.#tryGetEngine("ellipseFilled").drawApi.drawEllipseFilled(
        xy,
        wh,
        color,
      );
    },

    ellipseOutsideFilled(
      xy: BpxVector2d,
      wh: BpxVector2d,
      color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
    ): void {
      BeetPx.#tryGetEngine(
        "ellipseOutsideFilled",
      ).drawApi.drawEllipseOutsideFilled(xy, wh, color);
    },

    /**
     * @returns previous sprite color mapping
     */
    setSpriteColorMapping(
      spriteColorMapping: BpxSpriteColorMapping,
    ): BpxSpriteColorMapping {
      return BeetPx.#tryGetEngine(
        "setSpriteColorMapping",
      ).drawApi.setSpriteColorMapping(spriteColorMapping);
    },

    sprite(
      sprite: BpxSprite | BpxAnimatedSprite,
      xy: BpxVector2d,
      opts?: {
        centerXy?: [boolean, boolean];
        scaleXy?: BpxVector2d;
        flipXy?: [boolean, boolean];
      },
    ): void {
      BeetPx.#tryGetEngine("sprite").drawApi.drawSprite(sprite, xy, opts);
    },

    /**
     * @returns - previously used font
     */
    useFont(font: BpxFont): BpxFont {
      return BeetPx.#tryGetEngine("useFont").drawApi.useFont(font);
    },

    measureText(
      text: string,
      opts?: {
        centerXy?: [boolean, boolean];
        scaleXy?: BpxVector2d;
        colorMarkers?: BpxTextColorMarkers;
      },
    ): { wh: BpxVector2d; offset: BpxVector2d } {
      return BeetPx.#tryGetEngine("measureText").drawApi.measureText(
        text,
        opts,
      );
    },

    text(
      text: string,
      xy: BpxVector2d,
      color: BpxRgbColor,
      opts?: {
        centerXy?: [boolean, boolean];
        scaleXy?: BpxVector2d;
        colorMarkers?: BpxTextColorMarkers;
      },
    ): void {
      BeetPx.#tryGetEngine("text").drawApi.drawText(text, xy, color, opts);
    },

    takeCanvasSnapshot(): void {
      BeetPx.#tryGetEngine("takeCanvasSnapshot").drawApi.takeCanvasSnapshot();
    },
  };

  //
  // Utils
  //

  static utils = {
    assertUnreachable,
    booleanChangingEveryNthFrame,
    clamp,
    drawTextWithOutline,
    identity,
    isDefined,
    lerp,
    mod,
    noop,
    offset4Directions,
    offset8Directions,
    randomElementOf,
    range,
    repeatEachElement,
    throwError,
    trigAtan2,
    trigCos,
    trigSin,
    wait,
  };
}

/////////////////////////////////////////////////////////////////////////////

export const $ = BeetPx;
export const $d = BeetPx.draw;
export const $u = BeetPx.utils;
