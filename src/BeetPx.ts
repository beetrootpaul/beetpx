// noinspection JSUnusedGlobalSymbols

import { type BpxEngineConfig, Engine } from "./Engine";
import {
  BpxImageAsset,
  BpxImageUrl,
  BpxJsonAsset,
  BpxJsonUrl,
  BpxSoundAsset,
  BpxSoundUrl,
} from "./assets/Assets";
import type { BpxAudioPlaybackId } from "./audio/AudioPlayback";
import { BpxSoundSequence } from "./audio/SoundSequence";
import { BpxBrowserType } from "./browser/BrowserTypeDetector";
import { BpxCanvasSnapshotColorMapping } from "./color/CanvasSnapshotColorMapping";
import { BpxPatternColors } from "./color/PatternColors";
import { BpxRgbColor } from "./color/RgbColor";
import { BpxSpriteColorMapping } from "./color/SpriteColorMapping";
import { DebugMode } from "./debug/DebugMode";
import { BpxTextMeasurement } from "./draw_api/DrawApi";
import { BpxDrawingPattern } from "./draw_api/DrawingPattern";
import { BpxPixels } from "./draw_api/Pixels";
import { BpxFont, BpxTextColorMarkers } from "./font/Font";
import { BpxGameInputEvent, GameInputMethod } from "./game_input/GameInput";
import { BpxGamepadType } from "./game_input/GameInputGamepad";
import { BpxGameButtonName } from "./game_input/buttons/GameButtons";
import { Logger } from "./logger/Logger";
import { BpxVector2d } from "./misc/Vector2d";
import { GlobalPause } from "./pause/GlobalPause";
import { BpxAnimatedSprite } from "./sprite/AnimatedSprite";
import { BpxSprite } from "./sprite/Sprite";
import { BpxPersistedStateValueConstraints } from "./storage/StorageApi";
import { assertUnreachable } from "./utils/assertUnreachable";
import { booleanChangingEveryNthFrame } from "./utils/booleanChangingEveryNthFrame";
import { clamp } from "./utils/clamp";
import { drawTextWithOutline } from "./utils/drawTextWithOutline";
import { identity } from "./utils/identity";
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

/////////////////////////////////////////////////////////////////////////////

export class BeetPx {
  // Make sure the constructor is private:
  private constructor() {}

  static #engine: Engine;

  static #dataStoredBeforeEngineStarted: {
    onStarted?: () => void;
    onUpdate?: () => void;
    onDraw?: () => void;
  } = {};

  static async start(config?: BpxEngineConfig): Promise<void> {
    if (this.#engine) {
      throw Error("BeetPx is already started");
    }

    Logger.infoBeetPx(`BeetPx ${window.BEETPX__VERSION} : Initializing…`);
    this.#engine = new Engine(config);
    const { startGame } = await this.#engine.init();
    Logger.infoBeetPx(`BeetPx ${window.BEETPX__VERSION} : Initialized`);

    if (this.#dataStoredBeforeEngineStarted.onStarted) {
      this.#engine.setOnStarted(this.#dataStoredBeforeEngineStarted.onStarted);
    }
    if (this.#dataStoredBeforeEngineStarted.onUpdate) {
      this.#engine.setOnUpdate(this.#dataStoredBeforeEngineStarted.onUpdate);
    }
    if (this.#dataStoredBeforeEngineStarted.onDraw) {
      this.#engine.setOnDraw(this.#dataStoredBeforeEngineStarted.onDraw);
    }
    this.#dataStoredBeforeEngineStarted = {};

    return await startGame();
  }

  static get debug(): boolean {
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

  static setOnStarted(onStarted?: () => void): void {
    if (this.#engine) {
      this.#engine.setOnStarted(onStarted);
    } else {
      this.#dataStoredBeforeEngineStarted.onStarted = onStarted;
    }
  }

  static setOnUpdate(onUpdate?: () => void): void {
    if (this.#engine) {
      this.#engine.setOnUpdate(onUpdate);
    } else {
      this.#dataStoredBeforeEngineStarted.onUpdate = onUpdate;
    }
  }

  static setOnDraw(onDraw?: () => void): void {
    if (this.#engine) {
      this.#engine.setOnDraw(onDraw);
    } else {
      this.#dataStoredBeforeEngineStarted.onDraw = onDraw;
    }
  }

  static restart(): void {
    this.#tryGetEngine().restart();
  }

  //
  // Logger
  //

  static logDebug(...args: unknown[]): void {
    Logger.debug(...args);
  }

  static logInfo(...args: unknown[]): void {
    Logger.info(...args);
  }

  static logWarn(...args: unknown[]): void {
    Logger.warn(...args);
  }

  static logError(...args: unknown[]): void {
    Logger.error(...args);
  }

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

  static wasAnyButtonJustPressed(): boolean {
    return this.#tryGetEngine().gameInput.gameButtons.wasAnyJustPressed();
  }

  static wasButtonJustPressed(button: BpxGameButtonName): boolean {
    return this.#tryGetEngine().gameInput.gameButtons.wasJustPressed(button);
  }

  static wasButtonJustReleased(button: BpxGameButtonName): boolean {
    return this.#tryGetEngine().gameInput.gameButtons.wasJustReleased(button);
  }

  static isAnyButtonPressed(): boolean {
    return this.#tryGetEngine().gameInput.gameButtons.isAnyPressed();
  }

  static isButtonPressed(button: BpxGameButtonName): boolean {
    return this.#tryGetEngine().gameInput.gameButtons.isPressed(button);
  }

  static getPressedDirection(): BpxVector2d {
    return this.#tryGetEngine().gameInput.gameButtons.getPressedDirection();
  }

  static setButtonRepeating(
    button: BpxGameButtonName,
    repeating: {
      firstRepeatFrames: number | null;
      loopedRepeatFrames: number | null;
    },
  ): void {
    this.#tryGetEngine().gameInput.gameButtons.setButtonRepeating(
      button,
      repeating,
    );
  }

  static getRecentInputMethods(): Set<GameInputMethod> {
    return this.#tryGetEngine().gameInput.getRecentInputMethods();
  }

  static getConnectedGamepadTypes(): Set<BpxGamepadType> {
    return this.#tryGetEngine().gameInput.getConnectedGamepadTypes();
  }

  static getEventsCapturedInLastUpdate(): Set<BpxGameInputEvent> {
    return this.#tryGetEngine().gameInput.getEventsCapturedInLastUpdate();
  }

  //
  // Audio API
  //

  static isAudioMuted(): boolean {
    return this.#tryGetEngine().audioApi.isAudioMuted();
  }

  static muteAudio(opts?: { fadeOutMillis?: number }): void {
    this.#tryGetEngine().audioApi.muteAudio(opts);
  }

  static unmuteAudio(opts?: { fadeInMillis?: number }): void {
    this.#tryGetEngine().audioApi.unmuteAudio(opts);
  }

  static startPlayback(
    soundUrl: BpxSoundUrl,
    opts?: {
      muteOnStart?: boolean;
      onGamePause?: "pause" | "mute" | "ignore";
    },
  ): BpxAudioPlaybackId {
    return this.#tryGetEngine().audioApi.startPlayback(soundUrl, opts);
  }

  static startPlaybackLooped(
    soundUrl: BpxSoundUrl,
    opts?: {
      muteOnStart?: boolean;
      onGamePause?: "pause" | "mute" | "ignore";
    },
  ): BpxAudioPlaybackId {
    return this.#tryGetEngine().audioApi.startPlaybackLooped(soundUrl, opts);
  }

  static startPlaybackSequence(
    soundSequence: BpxSoundSequence,
    opts?: {
      muteOnStart?: boolean;
      onGamePause?: "pause" | "mute" | "ignore";
    },
  ): BpxAudioPlaybackId {
    return this.#tryGetEngine().audioApi.startPlaybackSequence(
      soundSequence,
      opts,
    );
  }

  static mutePlayback(
    playbackId: BpxAudioPlaybackId,
    opts?: { fadeOutMillis?: number },
  ): void {
    this.#tryGetEngine().audioApi.mutePlayback(playbackId, opts);
  }

  static unmutePlayback(
    playbackId: BpxAudioPlaybackId,
    opts?: { fadeInMillis?: number },
  ): void {
    this.#tryGetEngine().audioApi.unmutePlayback(playbackId, opts);
  }

  static stopPlayback(
    playbackId: BpxAudioPlaybackId,
    opts?: { fadeOutMillis?: number },
  ): void {
    this.#tryGetEngine().audioApi.stopPlayback(playbackId, opts);
  }

  static pausePlayback(playbackId: BpxAudioPlaybackId): void {
    this.#tryGetEngine().audioApi.pausePlayback(playbackId);
  }

  static resumePlayback(playbackId: BpxAudioPlaybackId): void {
    this.#tryGetEngine().audioApi.resumePlayback(playbackId);
  }

  static getAudioContext(): AudioContext {
    return this.#tryGetEngine().audioApi.getAudioContext();
  }

  //
  // Full Screen
  //

  static isFullScreenSupported(): boolean {
    return this.#tryGetEngine().fullScreen.isFullScreenSupported();
  }

  static isInFullScreen(): boolean {
    return this.#tryGetEngine().fullScreen.isInFullScreen();
  }

  static toggleFullScreen(): void {
    this.#tryGetEngine().fullScreen.toggleFullScreen();
  }

  //
  // Storage API
  //

  static savePersistedState<
    PersistedStateValue extends BpxPersistedStateValueConstraints,
  >(value: PersistedStateValue): void {
    this.#tryGetEngine().storageApi.savePersistedState(value);
  }

  static loadPersistedState<
    PersistedStateValue extends BpxPersistedStateValueConstraints,
  >(): PersistedStateValue | null {
    return this.#tryGetEngine().storageApi.loadPersistedState();
  }

  static clearPersistedState(): void {
    this.#tryGetEngine().storageApi.clearPersistedState();
  }

  //
  // Direct access to loaded assets
  //

  static getImageAsset(imageUrl: BpxImageUrl): BpxImageAsset {
    return this.#tryGetEngine().assets.getImageAsset(imageUrl);
  }

  static getSoundAsset(soundUrl: BpxSoundUrl): BpxSoundAsset {
    return this.#tryGetEngine().assets.getSoundAsset(soundUrl);
  }

  static getJsonAsset(jsonUrl: BpxJsonUrl): BpxJsonAsset {
    return this.#tryGetEngine().assets.getJsonAsset(jsonUrl);
  }

  //
  // private helpers
  //

  static #tryGetEngine(drawFnNameToLogIfOutsideDrawCallback?: string): Engine {
    if (!this.#engine) {
      throw Error(
        `Tried to access BeetPx API without calling BeetPx.start(…) first.`,
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
    setFont(font: BpxFont): BpxFont {
      return BeetPx.#tryGetEngine("setFont").drawApi.setFont(font);
    },

    /**
     * @returns - previously used color markers
     */
    setTextColorMarkers(
      textColorMarkers: BpxTextColorMarkers,
    ): BpxTextColorMarkers {
      return BeetPx.#tryGetEngine(
        "setTextColorMarkers",
      ).drawApi.setTextColorMarkers(textColorMarkers);
    },

    measureText(
      text: string,
      opts?: {
        centerXy?: [boolean, boolean];
        scaleXy?: BpxVector2d;
      },
    ): BpxTextMeasurement {
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
    /**
     * This function is meant to be used in a last branch of `if - else if - … - else`
     *   chain or in `default` of `switch - case - case - …`. Let's imagine there is
     *   a union type of which we check all possible cases. Someday we add one more
     *   type to the union, but we forget to extend our `switch` by that one more `case`.
     *   Thanks to `assertUnreachable(theValueOfThatUnionType)` the TypeScript checker
     *   will inform us about such mistake.
     *
     * @param thingThatShouldBeOfTypeNeverAtThisPoint - a value which we expect to be of type never
     */
    assertUnreachable,
    booleanChangingEveryNthFrame,
    /**
     * Returns the middle number. Example usage: `clamp(min, value, max)`
     *   in order to find a value which is:
     *   - `value` if it is `>= min` and `<= max`
     *   - `min` if `value` is `< min`
     *   - `max` if `value` is `> max`
     */
    clamp,
    drawTextWithOutline,
    identity,
    lerp,
    /**
     * a modulo operation – in contrary to native `%`, this returns results from [0, n) range (positive values only)
     */
    mod,
    noop,
    /**
     * Generates a list of XY to add to a given coordinate in order to get all offsets by 1 pixel in 4 directions.
     */
    offset4Directions,
    /**
     * Generates a list of XY to add to a given coordinate in order to get all offsets by 1 pixel in 8 directions.
     */
    offset8Directions,
    randomElementOf,
    range,
    repeatEachElement,
    /**
     * To be used as a value, e.g. in `definedValue: maybeUndefined() ?? throwError("…")`.
     */
    throwError,
    /**
     * @return turn angle. A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    trigAtan2,
    /**
     * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    trigCos(turnAngle: number): number {
      return trigCos(turnAngle);
    },
    /**
     * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    trigSin,
  };
}

/////////////////////////////////////////////////////////////////////////////

export const $ = BeetPx;
export const $d = BeetPx.draw;
export const $u = BeetPx.utils;
