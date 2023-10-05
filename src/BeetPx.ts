// noinspection JSUnusedGlobalSymbols

import { Assets, AssetsToLoad } from "./Assets";
import { AudioApi } from "./audio/AudioApi";
import { BpxSolidColor } from "./Color";
import { DebugMode } from "./debug/DebugMode";
import { DrawApi } from "./draw_api/DrawApi";
import { BpxCharSprite } from "./font/Font";
import { Framework, type FrameworkOptions } from "./Framework";
import { Buttons } from "./game_input/Buttons";
import { Logger } from "./logger/Logger";
import { StorageApi } from "./storage/StorageApi";
import { BpxVector2d } from "./Vector2d";

export class BeetPx {
  static #framework: Framework;

  //
  // The most important function, _has to be called first_ in order to properly initialize other fields and variables.
  //

  static init(
    frameworkOptions: FrameworkOptions,
    assetsToLoad: AssetsToLoad,
  ): ReturnType<Framework["loadAssets"]> {
    this.#framework = new Framework(frameworkOptions);
    return this.#framework.loadAssets(assetsToLoad);
  }

  //
  // field-like getters, the ones meant to be used
  //

  static get debug(): typeof DebugMode.enabled {
    return DebugMode.enabled;
  }

  /**
   * Number of frames processed since game started.
   * It gets reset to 0 when `BeetPx.restart()` is called.
   * It counts update calls, not draw calls.
   */
  static get frameNumber(): Framework["frameNumber"] {
    return this.#tryGetFramework().frameNumber;
  }

  static get renderFps(): Framework["renderFps"] {
    return this.#tryGetFramework().renderFps;
  }

  //
  // field-like getters, the ones that shouldn't be needed in theory, but in practice they are ¯\_(ツ)_/¯
  //

  static get audioContext(): AudioApi["audioContext"] {
    return this.#tryGetFramework().audioApi.audioContext;
  }

  static get globalGainNode(): AudioApi["globalGainNode"] {
    return this.#tryGetFramework().audioApi.globalGainNode;
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
  // Buttons
  //

  static isPressed: Buttons["isPressed"] = (...args) => {
    return this.#tryGetFramework().gameInput.gameButtons.isPressed(...args);
  };

  static setRepeating: Buttons["setRepeating"] = (...args) => {
    return this.#tryGetFramework().gameInput.gameButtons.setRepeating(...args);
  };

  static wasJustPressed: Buttons["wasJustPressed"] = (...args) => {
    return this.#tryGetFramework().gameInput.gameButtons.wasJustPressed(
      ...args,
    );
  };

  static wasJustReleased: Buttons["wasJustReleased"] = (...args) => {
    return this.#tryGetFramework().gameInput.gameButtons.wasJustReleased(
      ...args,
    );
  };

  //
  // Draw API
  //

  static setCameraOffset: DrawApi["setCameraOffset"] = (...args) => {
    return this.#tryGetFramework().drawApi.setCameraOffset(...args);
  };

  static setClippingRegion: DrawApi["setClippingRegion"] = (...args) => {
    return this.#tryGetFramework().drawApi.setClippingRegion(...args);
  };

  static removeClippingRegion: DrawApi["removeClippingRegion"] = (...args) => {
    return this.#tryGetFramework().drawApi.removeClippingRegion(...args);
  };

  static setFillPattern: DrawApi["setFillPattern"] = (...args) => {
    return this.#tryGetFramework().drawApi.setFillPattern(...args);
  };

  static mapSpriteColors: DrawApi["mapSpriteColors"] = (...args) => {
    return this.#tryGetFramework().drawApi.mapSpriteColors(...args);
  };

  static setFont: DrawApi["setFont"] = (...args) => {
    return this.#tryGetFramework().drawApi.setFont(...args);
  };

  static getFont: DrawApi["getFont"] = (...args) => {
    return this.#tryGetFramework().drawApi.getFont(...args);
  };

  static clearCanvas: DrawApi["clearCanvas"] = (...args) => {
    return this.#tryGetFramework().drawApi.clearCanvas(...args);
  };

  static pixel: DrawApi["pixel"] = (...args) => {
    return this.#tryGetFramework().drawApi.pixel(...args);
  };

  static line: DrawApi["line"] = (...args) => {
    return this.#tryGetFramework().drawApi.line(...args);
  };

  static rect: DrawApi["rect"] = (...args) => {
    return this.#tryGetFramework().drawApi.rect(...args);
  };

  static rectFilled: DrawApi["rectFilled"] = (...args) => {
    return this.#tryGetFramework().drawApi.rectFilled(...args);
  };

  static ellipse: DrawApi["ellipse"] = (...args) => {
    return this.#tryGetFramework().drawApi.ellipse(...args);
  };

  static ellipseFilled: DrawApi["ellipseFilled"] = (...args) => {
    return this.#tryGetFramework().drawApi.ellipseFilled(...args);
  };

  // TODO: make sure the whole API gets nice JSDoc even shown in the game itself, in IDE

  static sprite: DrawApi["sprite"] = (...args) => {
    return this.#tryGetFramework().drawApi.sprite(...args);
  };

  // TODO: Create a similar JSDocs API description for other API methods as well

  /**
   * Draws a text on the canvas
   *
   * @param text
   * @param canvasXy1 top-left text corner
   * @param color text color or a function which returns a text color for a given character
   */
  static print: DrawApi["print"] = (
    text: string,
    canvasXy1: BpxVector2d,
    color: BpxSolidColor | ((charSprite: BpxCharSprite) => BpxSolidColor),
  ) => {
    return this.#tryGetFramework().drawApi.print(text, canvasXy1, color);
  };

  //
  // Audio API
  //

  static toggleMuteUnmute: AudioApi["toggleMuteUnmute"] = (...args) => {
    return this.#tryGetFramework().audioApi.toggleMuteUnmute(...args);
  };

  static playSoundOnce: AudioApi["playSoundOnce"] = (...args) => {
    return this.#tryGetFramework().audioApi.playSoundOnce(...args);
  };

  static playSoundLooped: AudioApi["playSoundLooped"] = (...args) => {
    return this.#tryGetFramework().audioApi.playSoundLooped(...args);
  };

  static playSoundSequence: AudioApi["playSoundSequence"] = (...args) => {
    return this.#tryGetFramework().audioApi.playSoundSequence(...args);
  };

  static stopAllSounds: AudioApi["stopAllSounds"] = (...args) => {
    return this.#tryGetFramework().audioApi.stopAllSounds(...args);
  };

  static muteSound: AudioApi["muteSound"] = (...args) => {
    return this.#tryGetFramework().audioApi.muteSound(...args);
  };

  static unmuteSound: AudioApi["unmuteSound"] = (...args) => {
    return this.#tryGetFramework().audioApi.unmuteSound(...args);
  };

  //
  // Storage API
  //

  static store: StorageApi["store"] = (...args) => {
    return this.#tryGetFramework().storageApi.store(...args);
  };

  static load: StorageApi["load"] = (...args) => {
    return this.#tryGetFramework().storageApi.load(...args);
  };

  static clearStorage: StorageApi["clearStorage"] = (...args) => {
    return this.#tryGetFramework().storageApi.clearStorage(...args);
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
