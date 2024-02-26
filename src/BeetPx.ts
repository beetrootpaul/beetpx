// noinspection JSUnusedGlobalSymbols

import { AssetsToLoad } from "./assets/AssetLoader";
import { Assets } from "./assets/Assets";
import { AudioApi } from "./audio/AudioApi";
import { DebugMode } from "./debug/DebugMode";
import { DrawApi } from "./draw_api/DrawApi";
import { Framework, type FrameworkOptions } from "./Framework";
import { Buttons } from "./game_input/buttons/Buttons";
import { GameInput } from "./game_input/GameInput";
import { Logger } from "./logger/Logger";
import { FullScreen } from "./misc/FullScreen";
import { StorageApi } from "./storage/StorageApi";

export class BeetPx {
  static #framework: Framework;

  //
  // The most important function, _has to be called first_ in order to properly initialize other fields and variables.
  //

  static init(
    frameworkOptions: FrameworkOptions,
    assetsToLoad: AssetsToLoad,
  ): ReturnType<Framework["init"]> {
    Logger.infoBeetPx(`Initializing BeetPx ${BEETPX__VERSION} …`);

    this.#framework = new Framework(frameworkOptions);
    return this.#framework.init(assetsToLoad);
  }

  //
  // field-like getters
  //

  static get debug(): typeof DebugMode.enabled {
    return DebugMode.enabled;
  }

  /**
   * Number of frames processed since game started.
   * It gets reset to 0 when `BeetPx.restart()` is called.
   * It counts update calls, not draw calls.
   *
   * @return number
   */
  static get frame(): Framework["frame"] {
    return this.#tryGetFramework().frame;
  }

  static get renderingFps(): Framework["renderingFps"] {
    return this.#tryGetFramework().renderingFps;
  }

  static get detectedBrowserType(): Framework["detectedBrowserType"] {
    return this.#tryGetFramework().detectedBrowserType;
  }

  //
  // lifecycle methods
  //

  static setOnStarted: Framework["setOnStarted"] = (...args) => {
    return this.#tryGetFramework().setOnStarted(...args);
  };

  static setOnUpdate: Framework["setOnUpdate"] = (...args) => {
    return this.#tryGetFramework().setOnUpdate(...args);
  };

  static setOnDraw: Framework["setOnDraw"] = (...args) => {
    return this.#tryGetFramework().setOnDraw(...args);
  };

  static restart: Framework["restart"] = (...args) => {
    return this.#tryGetFramework().restart(...args);
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
  // Game Input & Buttons
  //

  static wasButtonJustPressed: Buttons["wasJustPressed"] = (...args) => {
    return this.#tryGetFramework().gameInput.gameButtons.wasJustPressed(
      ...args,
    );
  };

  static wasButtonJustReleased: Buttons["wasJustReleased"] = (...args) => {
    return this.#tryGetFramework().gameInput.gameButtons.wasJustReleased(
      ...args,
    );
  };

  static isButtonPressed: Buttons["isPressed"] = (...args) => {
    return this.#tryGetFramework().gameInput.gameButtons.isPressed(...args);
  };

  static getPressedDirection: Buttons["getPressedDirection"] = (...args) => {
    return this.#tryGetFramework().gameInput.gameButtons.getPressedDirection(
      ...args,
    );
  };

  static setButtonRepeating: Buttons["setRepeating"] = (...args) => {
    return this.#tryGetFramework().gameInput.gameButtons.setRepeating(...args);
  };

  static getRecentInputMethods: GameInput["getRecentInputMethods"] = (
    ...args
  ) => {
    return this.#tryGetFramework().gameInput.getRecentInputMethods(...args);
  };

  static getConnectedGamepadTypes: GameInput["getConnectedGamepadTypes"] = (
    ...args
  ) => {
    return this.#tryGetFramework().gameInput.getConnectedGamepadTypes(...args);
  };

  static getEventsCapturedInLastUpdate: GameInput["getEventsCapturedInLastUpdate"] =
    (...args) => {
      return this.#tryGetFramework().gameInput.getEventsCapturedInLastUpdate(
        ...args,
      );
    };

  //
  // Draw API
  //

  static clearCanvas: DrawApi["clearCanvas"] = (...args) => {
    return this.#tryGetFramework().drawApi.clearCanvas(...args);
  };

  /**
   * @returns - previous clipping region in form of an array: [xy, wh]
   */
  static setClippingRegion: DrawApi["setClippingRegion"] = (...args) => {
    return this.#tryGetFramework().drawApi.setClippingRegion(...args);
  };

  /**
   * @returns - previous clipping region in form of an array: [xy, wh]
   */
  static removeClippingRegion: DrawApi["removeClippingRegion"] = (...args) => {
    return this.#tryGetFramework().drawApi.removeClippingRegion(...args);
  };

  /**
   * Sets a new XY (left-top corner) of a camera's viewport
   *
   * @returns previous camera XY
   */
  static setCameraXy: DrawApi["setCameraXy"] = (...args) => {
    return this.#tryGetFramework().drawApi.setCameraXy(...args);
  };

  /**
   * @returns previous pattern
   */
  static setDrawingPattern: DrawApi["setDrawingPattern"] = (...args) => {
    return this.#tryGetFramework().drawApi.setDrawingPattern(...args);
  };

  static drawPixel: DrawApi["drawPixel"] = (...args) => {
    return this.#tryGetFramework().drawApi.drawPixel(...args);
  };

  /**
   * @param {BpxVector2d} xy - sd
   * @param {BpxRgbColor} color - sd
   * @param {string[]} bits - an array representing rows from top to bottom,
   *        where each array element is a text sequence of `0` and `1` to
   *        represent drawn and skipped pixels from left to right.
   */
  /**
   * Draws pixels based on a visual 2d representation in form of rows
   *   (designated by new lines) where `#` and `-` stand for a colored
   *   pixel and a lack of a pixel. Whitespaces are ignored.
   */
  static drawPixels: DrawApi["drawPixels"] = (...args) => {
    return this.#tryGetFramework().drawApi.drawPixels(...args);
  };

  static drawLine: DrawApi["drawLine"] = (...args) => {
    return this.#tryGetFramework().drawApi.drawLine(...args);
  };

  static drawRect: DrawApi["drawRect"] = (...args) => {
    return this.#tryGetFramework().drawApi.drawRect(...args);
  };

  static drawRectFilled: DrawApi["drawRectFilled"] = (...args) => {
    return this.#tryGetFramework().drawApi.drawRectFilled(...args);
  };

  static drawEllipse: DrawApi["drawEllipse"] = (...args) => {
    return this.#tryGetFramework().drawApi.drawEllipse(...args);
  };

  static drawEllipseFilled: DrawApi["drawEllipseFilled"] = (...args) => {
    return this.#tryGetFramework().drawApi.drawEllipseFilled(...args);
  };

  /**
   * @returns previous sprite color mapping
   */
  static setSpriteColorMapping: DrawApi["setSpriteColorMapping"] = (
    ...args
  ) => {
    return this.#tryGetFramework().drawApi.setSpriteColorMapping(...args);
  };

  static drawSprite: DrawApi["drawSprite"] = (...args) => {
    return this.#tryGetFramework().drawApi.drawSprite(...args);
  };

  static setFont: DrawApi["setFont"] = (...args) => {
    return this.#tryGetFramework().drawApi.setFont(...args);
  };

  static getFont: DrawApi["getFont"] = (...args) => {
    return this.#tryGetFramework().drawApi.getFont(...args);
  };

  static drawText: DrawApi["drawText"] = (...args) => {
    return this.#tryGetFramework().drawApi.drawText(...args);
  };

  static takeCanvasSnapshot: DrawApi["takeCanvasSnapshot"] = (...args) => {
    return this.#tryGetFramework().drawApi.takeCanvasSnapshot(...args);
  };

  //
  // Audio API
  //

  static isAudioMuted: AudioApi["isAudioMuted"] = (...args) => {
    return this.#tryGetFramework().audioApi.isAudioMuted(...args);
  };

  static muteAudio: AudioApi["muteAudio"] = (...args) => {
    return this.#tryGetFramework().audioApi.muteAudio(...args);
  };

  static unmuteAudio: AudioApi["unmuteAudio"] = (...args) => {
    return this.#tryGetFramework().audioApi.unmuteAudio(...args);
  };

  static pauseAudio: AudioApi["pauseAudio"] = (...args) => {
    return this.#tryGetFramework().audioApi.pauseAudio(...args);
  };

  static resumeAudio: AudioApi["resumeAudio"] = (...args) => {
    return this.#tryGetFramework().audioApi.resumeAudio(...args);
  };

  static startPlayback: AudioApi["startPlayback"] = (...args) => {
    return this.#tryGetFramework().audioApi.startPlayback(...args);
  };

  static startPlaybackLooped: AudioApi["startPlaybackLooped"] = (...args) => {
    return this.#tryGetFramework().audioApi.startPlaybackLooped(...args);
  };

  static startPlaybackSequence: AudioApi["startPlaybackSequence"] = (
    ...args
  ) => {
    return this.#tryGetFramework().audioApi.startPlaybackSequence(...args);
  };

  static mutePlayback: AudioApi["mutePlayback"] = (...args) => {
    return this.#tryGetFramework().audioApi.mutePlayback(...args);
  };

  static unmutePlayback: AudioApi["unmutePlayback"] = (...args) => {
    return this.#tryGetFramework().audioApi.unmutePlayback(...args);
  };

  static stopPlayback: AudioApi["stopPlayback"] = (...args) => {
    return this.#tryGetFramework().audioApi.stopPlayback(...args);
  };

  static stopAllPlaybacks: AudioApi["stopAllPlaybacks"] = (...args) => {
    return this.#tryGetFramework().audioApi.stopAllPlaybacks(...args);
  };

  static getAudioContext: AudioApi["getAudioContext"] = (...args) => {
    return this.#tryGetFramework().audioApi.getAudioContext(...args);
  };

  //
  // Full Screen
  //

  static isFullScreenSupported: FullScreen["isFullScreenSupported"] = (
    ...args
  ) => {
    return this.#tryGetFramework().fullScreen.isFullScreenSupported(...args);
  };

  static isInFullScreen: FullScreen["isInFullScreen"] = (...args) => {
    return this.#tryGetFramework().fullScreen.isInFullScreen(...args);
  };

  static toggleFullScreen: FullScreen["toggleFullScreen"] = (...args) => {
    return this.#tryGetFramework().fullScreen.toggleFullScreen(...args);
  };

  //
  // Storage API
  //

  static savePersistedState: StorageApi["savePersistedState"] = (...args) => {
    return this.#tryGetFramework().storageApi.savePersistedState(...args);
  };

  static loadPersistedState: StorageApi["loadPersistedState"] = (...args) => {
    return this.#tryGetFramework().storageApi.loadPersistedState(...args);
  };

  static clearPersistedState: StorageApi["clearPersistedState"] = (...args) => {
    return this.#tryGetFramework().storageApi.clearPersistedState(...args);
  };

  //
  // Direct access to loaded assets
  //

  static getImageAsset: Assets["getImageAsset"] = (...args) => {
    return this.#tryGetFramework().assets.getImageAsset(...args);
  };

  static getFontAsset: Assets["getFontAsset"] = (...args) => {
    return this.#tryGetFramework().assets.getFontAsset(...args);
  };

  static getSoundAsset: Assets["getSoundAsset"] = (...args) => {
    return this.#tryGetFramework().assets.getSoundAsset(...args);
  };

  static getJsonAsset: Assets["getJsonAsset"] = (...args) => {
    return this.#tryGetFramework().assets.getJsonAsset(...args);
  };

  //
  // private helpers
  //

  static #tryGetFramework(): Framework {
    if (!this.#framework) {
      throw Error(
        `Tried to access BeetPx API without calling BeetPx.init(…) first.`,
      );
    }
    return this.#framework;
  }
}

export const b_ = BeetPx;
