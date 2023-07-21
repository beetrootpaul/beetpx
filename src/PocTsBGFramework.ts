import { AssetsToLoad } from "./Assets";
import { Audio } from "./audio/Audio";
import { DrawApi } from "./draw_api/DrawApi";
import { Framework, type FrameworkOptions } from "./Framework";
import { GameInputEvent } from "./game_input/GameInput";
import { StorageApi } from "./StorageApi";

//  This class is only a facade over other capabilities of this game framework.
//    It serves as a public, global, statically accessible API.
//    Inspiration: [PICO-8's API](https://www.lexaloffle.com/dl/docs/pico-8_manual.html).

// TODO: flatten to have to use a single dot only. Flat API is OK
// TODO: review the whole public API and rename from the usage point of view
// TODO: after name for the framework gets chosen: rename this to the framework name or to its abbreviation
export class PocTsBGFramework {
  static #framework: Framework;

  // The most important function, has to be called first in order
  //   to properly initialize other fields and variables.
  //

  // TODO: type the startGame fn or the entire object inside resolved Promise
  static init(
    frameworkOptions: FrameworkOptions,
    assetsToLoad: AssetsToLoad,
  ): Promise<{ startGame: (onStart?: () => void) => void }> {
    PocTsBGFramework.#framework = new Framework(frameworkOptions);
    return PocTsBGFramework.#framework.loadAssets(assetsToLoad);
  }

  // Framework's lifecycle methods, exposed for a static access.
  //   Assumption: `init(…)` was called first in order to make `framework` defined.
  //

  static setOnUpdate(onUpdate: () => void) {
    PocTsBGFramework.#framework.setOnUpdate(onUpdate);
  }

  static setOnDraw(onDraw: () => void): void {
    PocTsBGFramework.#framework.setOnDraw(onDraw);
  }

  // The rest of the globally and statically available API.
  //   Assumption: `init(…)` was called first in order to make `framework` defined.
  //

  static frameNumber: number = 0;
  static averageFps: number = 1;
  static drawApi: DrawApi;
  static audio: Audio;
  static continuousInputEvents: Set<GameInputEvent>;
  static fireOnceInputEvents: Set<GameInputEvent>;
  static storageApi: StorageApi;

  // Debug flag.
  //

  static get debug(): boolean {
    return PocTsBGFramework.#framework.debug;
  }
}
