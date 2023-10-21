// noinspection JSUnusedGlobalSymbols

import { Assets, AssetsToLoad } from "./Assets";
import { AudioApi } from "./audio/AudioApi";
import { DebugMode } from "./debug/DebugMode";
import { DrawApi } from "./draw_api/DrawApi";
import { Framework, type FrameworkOptions } from "./Framework";
import { Buttons } from "./game_input/Buttons";
import { GameInput } from "./game_input/GameInput";
import { Logger } from "./logger/Logger";
import { StorageApi } from "./storage/StorageApi";

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

  static mostRecentInputMethods: GameInput["mostRecentInputMethods"] = (
    ...args
  ) => {
    return this.#tryGetFramework().gameInput.mostRecentInputMethods(...args);
  };

  static __internal__capturedEvents: GameInput["__internal__capturedEvents"] = (
    ...args
  ) => {
    return this.#tryGetFramework().gameInput.__internal__capturedEvents(
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

  static pixels: DrawApi["pixels"] = (...args) => {
    return this.#tryGetFramework().drawApi.pixels(...args);
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

  static print: DrawApi["print"] = (...args) => {
    return this.#tryGetFramework().drawApi.print(...args);
  };

  static takeCanvasSnapshot: DrawApi["takeCanvasSnapshot"] = (...args) => {
    return this.#tryGetFramework().drawApi.takeCanvasSnapshot(...args);
  };

  //
  // Audio API
  //

  static playSoundOnce: AudioApi["playSoundOnce"] = (...args) => {
    return this.#tryGetFramework().audioApi.playSoundOnce(...args);
  };

  static playSoundLooped: AudioApi["playSoundLooped"] = (...args) => {
    return this.#tryGetFramework().audioApi.playSoundLooped(...args);
  };

  static playSoundSequence: AudioApi["playSoundSequence"] = (...args) => {
    return this.#tryGetFramework().audioApi.playSoundSequence(...args);
  };

  static isAudioMuted: AudioApi["isAudioMuted"] = (...args) => {
    return this.#tryGetFramework().audioApi.isAudioMuted(...args);
  };

  static muteAudio: AudioApi["muteAudio"] = (...args) => {
    return this.#tryGetFramework().audioApi.muteAudio(...args);
  };

  static unmuteAudio: AudioApi["unmuteAudio"] = (...args) => {
    return this.#tryGetFramework().audioApi.unmuteAudio(...args);
  };

  static mutePlayback: AudioApi["mutePlayback"] = (...args) => {
    return this.#tryGetFramework().audioApi.mutePlayback(...args);
  };

  static unmutePlayback: AudioApi["unmutePlayback"] = (...args) => {
    return this.#tryGetFramework().audioApi.unmutePlayback(...args);
  };

  static pauseAudio: AudioApi["pauseAudio"] = (...args) => {
    return this.#tryGetFramework().audioApi.pauseAudio(...args);
  };

  static resumeAudio: AudioApi["resumeAudio"] = (...args) => {
    return this.#tryGetFramework().audioApi.resumeAudio(...args);
  };

  static stopAllPlaybacks: AudioApi["stopAllPlaybacks"] = (...args) => {
    return this.#tryGetFramework().audioApi.stopAllPlaybacks(...args);
  };

  static stopPlayback: AudioApi["stopPlayback"] = (...args) => {
    return this.#tryGetFramework().audioApi.stopPlayback(...args);
  };

  static __internal__audioContext: AudioApi["__internal__audioContext"] = (
    ...args
  ) => {
    return this.#tryGetFramework().audioApi.__internal__audioContext(...args);
  };

  static __internal__globalGainNode: AudioApi["__internal__globalGainNode"] = (
    ...args
  ) => {
    return this.#tryGetFramework().audioApi.__internal__globalGainNode(...args);
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
