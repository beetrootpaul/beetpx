// noinspection JSUnusedGlobalSymbols

import { AssetsToLoad } from "./Assets";
import { AudioApi } from "./audio/AudioApi";
import { DrawApi } from "./draw_api/DrawApi";
import { Framework, type FrameworkOptions } from "./Framework";
import { StorageApi } from "./StorageApi";

//  This class is only a facade over other capabilities of this game framework.
//    It serves as a public, global, statically accessible API.
//    Inspiration: [PICO-8's API](https://www.lexaloffle.com/dl/docs/pico-8_manual.html).

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
    return BeetPx.#framework.frameNumber;
  }

  static get averageFps(): Framework["averageFps"] {
    return BeetPx.#framework.averageFps;
  }

  static get continuousInputEvents(): Framework["continuousInputEvents"] {
    return BeetPx.#framework.continuousInputEvents;
  }

  static get fireOnceInputEvents(): Framework["fireOnceInputEvents"] {
    return BeetPx.#framework.fireOnceInputEvents;
  }

  static get audioContext(): AudioApi["audioContext"] {
    return this.#framework.audioApi.audioContext;
  }

  static get debug(): Framework["debug"] {
    return BeetPx.#framework.debug;
  }

  //
  // lifecycle methods
  //

  static setOnUpdate: Framework["setOnUpdate"] = (...args) => {
    return this.#framework.setOnUpdate(...args);
  };

  static setOnDraw: Framework["setOnDraw"] = (...args) => {
    return this.#framework.setOnDraw(...args);
  };

  //
  // Draw API
  //

  static setCameraOffset: DrawApi["setCameraOffset"] = (...args) => {
    return this.#framework.drawApi.setCameraOffset(...args);
  };

  static setFillPattern: DrawApi["setFillPattern"] = (...args) => {
    return this.#framework.drawApi.setFillPattern(...args);
  };

  static mapSpriteColor: DrawApi["mapSpriteColor"] = (...args) => {
    return this.#framework.drawApi.mapSpriteColor(...args);
  };

  static setFont: DrawApi["setFont"] = (...args) => {
    return this.#framework.drawApi.setFont(...args);
  };

  static getFont: DrawApi["getFont"] = (...args) => {
    return this.#framework.drawApi.getFont(...args);
  };

  static clearCanvas: DrawApi["clearCanvas"] = (...args) => {
    return this.#framework.drawApi.clearCanvas(...args);
  };

  static pixel: DrawApi["pixel"] = (...args) => {
    return this.#framework.drawApi.pixel(...args);
  };

  static rect: DrawApi["rect"] = (...args) => {
    return this.#framework.drawApi.rect(...args);
  };

  static rectFilled: DrawApi["rectFilled"] = (...args) => {
    return this.#framework.drawApi.rectFilled(...args);
  };

  static ellipse: DrawApi["ellipse"] = (...args) => {
    return this.#framework.drawApi.ellipse(...args);
  };

  static ellipseFilled: DrawApi["ellipseFilled"] = (...args) => {
    return this.#framework.drawApi.ellipseFilled(...args);
  };

  static sprite: DrawApi["sprite"] = (...args) => {
    return this.#framework.drawApi.sprite(...args);
  };

  static print: DrawApi["print"] = (...args) => {
    return this.#framework.drawApi.print(...args);
  };

  //
  // Audio API
  //

  static toggleMuteUnmute: AudioApi["toggleMuteUnmute"] = (...args) => {
    return this.#framework.audioApi.toggleMuteUnmute(...args);
  };

  static playSoundOnce: AudioApi["playSoundOnce"] = (...args) => {
    return this.#framework.audioApi.playSoundOnce(...args);
  };

  static playSoundLooped: AudioApi["playSoundLooped"] = (...args) => {
    return this.#framework.audioApi.playSoundLooped(...args);
  };

  static muteSound: AudioApi["muteSound"] = (...args) => {
    return this.#framework.audioApi.muteSound(...args);
  };

  static unmuteSound: AudioApi["unmuteSound"] = (...args) => {
    return this.#framework.audioApi.unmuteSound(...args);
  };

  //
  // Storage API
  //

  static store: StorageApi["store"] = (...args) => {
    return this.#framework.storageApi.store(...args);
  };

  static load: StorageApi["load"] = (...args) => {
    return this.#framework.storageApi.load(...args);
  };

  static clearStorage: StorageApi["clearStorage"] = (...args) => {
    return this.#framework.storageApi.clearStorage(...args);
  };
}
