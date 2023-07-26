// noinspection JSUnusedGlobalSymbols

import { AssetsToLoad } from "./Assets";
import { AudioApi } from "./audio/AudioApi";
import { DrawApi } from "./draw_api/DrawApi";
import { Framework, type FrameworkOptions } from "./Framework";
import { StorageApi } from "./StorageApi";

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
  // field-like getters
  //

  static get frameNumber(): Framework["frameNumber"] {
    return this.#tryGetFramework().frameNumber;
  }

  static get averageFps(): Framework["averageFps"] {
    return this.#tryGetFramework().averageFps;
  }

  static get continuousInputEvents(): Framework["continuousInputEvents"] {
    return this.#tryGetFramework().continuousInputEvents;
  }

  static get fireOnceInputEvents(): Framework["fireOnceInputEvents"] {
    return this.#tryGetFramework().fireOnceInputEvents;
  }

  static get audioContext(): AudioApi["audioContext"] {
    return this.#tryGetFramework().audioApi.audioContext;
  }

  static get debug(): Framework["debug"] {
    return this.#tryGetFramework().debug;
  }

  //
  // lifecycle methods
  //

  static setOnUpdate: Framework["setOnUpdate"] = (...args) => {
    return this.#tryGetFramework().setOnUpdate(...args);
  };

  static setOnDraw: Framework["setOnDraw"] = (...args) => {
    return this.#tryGetFramework().setOnDraw(...args);
  };

  //
  // Draw API
  //

  static setCameraOffset: DrawApi["setCameraOffset"] = (...args) => {
    return this.#tryGetFramework().drawApi.setCameraOffset(...args);
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

  static sprite: DrawApi["sprite"] = (...args) => {
    return this.#tryGetFramework().drawApi.sprite(...args);
  };

  static print: DrawApi["print"] = (...args) => {
    return this.#tryGetFramework().drawApi.print(...args);
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
