// noinspection JSUnusedGlobalSymbols

import { Assets } from "./assets/Assets";
import { AudioApi } from "./audio/AudioApi";
import { DebugMode } from "./debug/DebugMode";
import { DrawApi } from "./draw_api/DrawApi";
import { Engine, type EngineInitParams } from "./Engine";
import { GameButtons } from "./game_input/buttons/GameButtons";
import { GameInput } from "./game_input/GameInput";
import { Logger } from "./logger/Logger";
import { FullScreen } from "./misc/FullScreen";
import { StorageApi } from "./storage/StorageApi";

export class BeetPx {
  static #engine: Engine;

  //
  // The most important function, _has to be called first_ in order to properly initialize other fields and variables.
  //

  static init(engineInitParams?: EngineInitParams): ReturnType<Engine["init"]> {
    Logger.infoBeetPx(`Initializing BeetPx ${BEETPX__VERSION} …`);
    this.#engine = new Engine(engineInitParams);
    return this.#engine.init();
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
  static get frameNumber(): Engine["frameNumber"] {
    return this.#tryGetEngine().frameNumber;
  }

  static get renderingFps(): Engine["renderingFps"] {
    return this.#tryGetEngine().renderingFps;
  }

  static get detectedBrowserType(): Engine["detectedBrowserType"] {
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
  // Game Input & Buttons
  //

  static wasButtonJustPressed: GameButtons["wasJustPressed"] = (...args) => {
    return this.#tryGetEngine().gameInput.gameButtons.wasJustPressed(...args);
  };

  static wasButtonJustReleased: GameButtons["wasJustReleased"] = (...args) => {
    return this.#tryGetEngine().gameInput.gameButtons.wasJustReleased(...args);
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

  static setButtonRepeating: GameButtons["setRepeating"] = (...args) => {
    return this.#tryGetEngine().gameInput.gameButtons.setRepeating(...args);
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
  // Draw API
  //

  static clearCanvas: DrawApi["clearCanvas"] = (...args) => {
    return this.#tryGetEngine().drawApi.clearCanvas(...args);
  };

  /**
   * @returns - previous clipping region in form of an array: [xy, wh]
   */
  static setClippingRegion: DrawApi["setClippingRegion"] = (...args) => {
    return this.#tryGetEngine().drawApi.setClippingRegion(...args);
  };

  /**
   * @returns - previous clipping region in form of an array: [xy, wh]
   */
  static removeClippingRegion: DrawApi["removeClippingRegion"] = (...args) => {
    return this.#tryGetEngine().drawApi.removeClippingRegion(...args);
  };

  /**
   * Sets a new XY (left-top corner) of a camera's viewport
   *
   * @returns previous camera XY
   */
  static setCameraXy: DrawApi["setCameraXy"] = (...args) => {
    return this.#tryGetEngine().drawApi.setCameraXy(...args);
  };

  /**
   * @returns previous pattern
   */
  static setDrawingPattern: DrawApi["setDrawingPattern"] = (...args) => {
    return this.#tryGetEngine().drawApi.setDrawingPattern(...args);
  };

  static drawPixel: DrawApi["drawPixel"] = (...args) => {
    return this.#tryGetEngine().drawApi.drawPixel(...args);
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
    return this.#tryGetEngine().drawApi.drawPixels(...args);
  };

  static drawLine: DrawApi["drawLine"] = (...args) => {
    return this.#tryGetEngine().drawApi.drawLine(...args);
  };

  static drawRect: DrawApi["drawRect"] = (...args) => {
    return this.#tryGetEngine().drawApi.drawRect(...args);
  };

  static drawRectFilled: DrawApi["drawRectFilled"] = (...args) => {
    return this.#tryGetEngine().drawApi.drawRectFilled(...args);
  };

  static drawEllipse: DrawApi["drawEllipse"] = (...args) => {
    return this.#tryGetEngine().drawApi.drawEllipse(...args);
  };

  static drawEllipseFilled: DrawApi["drawEllipseFilled"] = (...args) => {
    return this.#tryGetEngine().drawApi.drawEllipseFilled(...args);
  };

  /**
   * @returns previous sprite color mapping
   */
  static setSpriteColorMapping: DrawApi["setSpriteColorMapping"] = (
    ...args
  ) => {
    return this.#tryGetEngine().drawApi.setSpriteColorMapping(...args);
  };

  static drawSprite: DrawApi["drawSprite"] = (...args) => {
    return this.#tryGetEngine().drawApi.drawSprite(...args);
  };

  static setFont: DrawApi["setFont"] = (...args) => {
    return this.#tryGetEngine().drawApi.setFont(...args);
  };

  static getFont: DrawApi["getFont"] = (...args) => {
    return this.#tryGetEngine().drawApi.getFont(...args);
  };

  static drawText: DrawApi["drawText"] = (...args) => {
    return this.#tryGetEngine().drawApi.drawText(...args);
  };

  static takeCanvasSnapshot: DrawApi["takeCanvasSnapshot"] = (...args) => {
    return this.#tryGetEngine().drawApi.takeCanvasSnapshot(...args);
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

  static pauseAudio: AudioApi["pauseAudio"] = (...args) => {
    return this.#tryGetEngine().audioApi.pauseAudio(...args);
  };

  static resumeAudio: AudioApi["resumeAudio"] = (...args) => {
    return this.#tryGetEngine().audioApi.resumeAudio(...args);
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

  static stopAllPlaybacks: AudioApi["stopAllPlaybacks"] = (...args) => {
    return this.#tryGetEngine().audioApi.stopAllPlaybacks(...args);
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

  static getFontAsset: Assets["getFontAsset"] = (...args) => {
    return this.#tryGetEngine().assets.getFontAsset(...args);
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

  static #tryGetEngine(): Engine {
    if (!this.#engine) {
      throw Error(
        `Tried to access BeetPx API without calling BeetPx.init(…) first.`,
      );
    }
    return this.#engine;
  }
}

export const b_ = BeetPx;
