/**
 * For TypeDoc:
 * @module API
 */

//
// NOTE: Shape of this file and the way things are defined (props vs methods vs static etc.)
//       is carefully picked in order to achieve a given end result in how the docs generated
//       by TypeDoc looks like.
//

/////////////////////////////////////////////////////////////////////////////

import type { BpxEngineConfig } from "./Engine";
import type {
  BpxImageAsset,
  BpxImageUrl,
  BpxJsonAsset,
  BpxJsonUrl,
  BpxSoundAsset,
  BpxSoundUrl,
} from "./assets/Assets";
import type { BpxAudioPlaybackId } from "./audio/AudioPlayback";
import type { BpxSoundSequence } from "./audio/SoundSequence";
import type { BpxBrowserType } from "./browser/BrowserTypeDetector";
import type { BpxCanvasSnapshotColorMapping } from "./color/CanvasSnapshotColorMapping";
import type { BpxPatternColors } from "./color/PatternColors";
import type { BpxRgbColor } from "./color/RgbColor";
import type { BpxSpriteColorMapping } from "./color/SpriteColorMapping";
import type { BpxTextMeasurement } from "./draw_api/DrawApi";
import type { BpxDrawingPattern } from "./draw_api/DrawingPattern";
import type { BpxPixels } from "./draw_api/Pixels";
import type { BpxFont, BpxTextColorMarkers } from "./font/Font";
import type {
  BpxGameInputEvent,
  GameInputMethod,
} from "./game_input/GameInput";
import type { BpxGamepadType } from "./game_input/GameInputGamepad";
import type { BpxGameButtonName } from "./game_input/buttons/GameButtons";
import type { BpxVector2d } from "./misc/Vector2d";
import type { BpxAnimatedSprite } from "./sprite/AnimatedSprite";
import type { BpxSprite } from "./sprite/Sprite";
import type { BpxPersistedStateValueConstraints } from "./storage/StorageApi";

/////////////////////////////////////////////////////////////////////////////

import { Engine } from "./Engine";
import { DebugMode } from "./debug/DebugMode";
import { Logger } from "./logger/Logger";
import { GlobalPause } from "./pause/GlobalPause";
import { assertUnreachable } from "./utils/assertUnreachable";
import { booleanChangingEveryNthFrame } from "./utils/booleanChangingEveryNthFrame";
import { clamp } from "./utils/clamp";
import { drawTextWithOutline } from "./utils/drawTextWithOutline";
import { identity } from "./utils/identity";
import { lerp } from "./utils/lerp";
import { mod } from "./utils/mod";
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

declare global {
  interface Window {
    BEETPX__IS_PROD: boolean;
    BEETPX__VERSION: string;
  }

  /**
   * @notExported
   * @category Globals
   */
  const BEETPX__IS_PROD: boolean;
  /**
   * @notExported
   * @category Globals
   */
  const BEETPX__VERSION: string;
}

/////////////////////////////////////////////////////////////////////////////

/**
 * @category API entry points
 */
export class BeetPx {
  // Make sure the constructor is private:
  private constructor() {}

  static #dataStoredBeforeEngineStarted: {
    onStarted?: () => void;
    onUpdate?: () => void;
    onDraw?: () => void;
  } = {};

  static #tryGetEngine(): Engine {
    if (!Engine.engineSingleton) {
      throw Error(
        `Tried to access BeetPx API without calling BeetPx.start(…) first.`,
      );
    }
    return Engine.engineSingleton;
  }

  //
  // START
  //

  /**
   * @category Lifecycle
   */
  static async start(config?: BpxEngineConfig): Promise<void> {
    if (Engine.engineSingleton) {
      throw Error("BeetPx is already started");
    }

    Logger.infoBeetPx(`BeetPx ${window.BEETPX__VERSION} : Initializing…`);
    Engine.engineSingleton = new Engine(config);
    const { startGame } = await Engine.engineSingleton.init();
    Logger.infoBeetPx(`BeetPx ${window.BEETPX__VERSION} : Initialized`);

    if (this.#dataStoredBeforeEngineStarted.onStarted) {
      Engine.engineSingleton.setOnStarted(
        this.#dataStoredBeforeEngineStarted.onStarted,
      );
    }
    if (this.#dataStoredBeforeEngineStarted.onUpdate) {
      Engine.engineSingleton.setOnUpdate(
        this.#dataStoredBeforeEngineStarted.onUpdate,
      );
    }
    if (this.#dataStoredBeforeEngineStarted.onDraw) {
      Engine.engineSingleton.setOnDraw(
        this.#dataStoredBeforeEngineStarted.onDraw,
      );
    }
    this.#dataStoredBeforeEngineStarted = {};

    return await startGame();
  }

  //
  // accessors
  //

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

  /**
   * @category Lifecycle
   */
  static setOnStarted(onStarted?: () => void): void {
    if (Engine.engineSingleton) {
      Engine.engineSingleton.setOnStarted(onStarted);
    } else {
      this.#dataStoredBeforeEngineStarted.onStarted = onStarted;
    }
  }

  /**
   * @category Lifecycle
   */
  static setOnUpdate(onUpdate?: () => void): void {
    if (Engine.engineSingleton) {
      Engine.engineSingleton.setOnUpdate(onUpdate);
    } else {
      this.#dataStoredBeforeEngineStarted.onUpdate = onUpdate;
    }
  }

  /**
   * @category Lifecycle
   */
  static setOnDraw(onDraw?: () => void): void {
    if (Engine.engineSingleton) {
      Engine.engineSingleton.setOnDraw(onDraw);
    } else {
      this.#dataStoredBeforeEngineStarted.onDraw = onDraw;
    }
  }

  /**
   * @category Lifecycle
   */
  static restart(): void {
    this.#tryGetEngine().restart();
  }

  //
  // Logger
  //

  /**
   * @category Logging
   */
  static logDebug(...args: unknown[]): void {
    Logger.debug(...args);
  }

  /**
   * @category Logging
   */
  static logInfo(...args: unknown[]): void {
    Logger.info(...args);
  }

  /**
   * @category Logging
   */
  static logWarn(...args: unknown[]): void {
    Logger.warn(...args);
  }

  /**
   * @category Logging
   */
  static logError(...args: unknown[]): void {
    Logger.error(...args);
  }

  //
  // Global Pause
  //

  /**
   * @category Global pause
   */
  static get isPaused(): boolean {
    return GlobalPause.isActive;
  }

  /**
   * @category Global pause
   */
  static get wasJustPaused(): boolean {
    return GlobalPause.wasJustActivated;
  }

  /**
   * @category Global pause
   */
  static get wasJustResumed(): boolean {
    return GlobalPause.wasJustDeactivated;
  }

  /**
   * @category Global pause
   */
  static pause(): void {
    GlobalPause.activate();
  }

  /**
   * @category Global pause
   */
  static resume(): void {
    GlobalPause.deactivate();
  }

  //
  // Game input
  //

  /**
   * @category Game input
   */
  static wasAnyButtonJustPressed(): boolean {
    return this.#tryGetEngine().gameInput.gameButtons.wasAnyJustPressed();
  }

  /**
   * @category Game input
   */
  static wasButtonJustPressed(button: BpxGameButtonName): boolean {
    return this.#tryGetEngine().gameInput.gameButtons.wasJustPressed(button);
  }

  /**
   * @category Game input
   */
  static wasButtonJustReleased(button: BpxGameButtonName): boolean {
    return this.#tryGetEngine().gameInput.gameButtons.wasJustReleased(button);
  }

  /**
   * @category Game input
   */
  static isAnyButtonPressed(): boolean {
    return this.#tryGetEngine().gameInput.gameButtons.isAnyPressed();
  }

  /**
   * @category Game input
   */
  static isButtonPressed(button: BpxGameButtonName): boolean {
    return this.#tryGetEngine().gameInput.gameButtons.isPressed(button);
  }

  /**
   * @category Game input
   * @example
   * ```ts
   * this.position += $.getPressedDirection().mul(this.speed);
   * ```
   */
  static getPressedDirection(): BpxVector2d {
    return this.#tryGetEngine().gameInput.gameButtons.getPressedDirection();
  }

  /**
   * @category Game input
   */
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

  /**
   * @category Game input
   */
  static getRecentInputMethods(): Set<GameInputMethod> {
    return this.#tryGetEngine().gameInput.getRecentInputMethods();
  }

  /**
   * @category Game input
   */
  static getConnectedGamepadTypes(): Set<BpxGamepadType> {
    return this.#tryGetEngine().gameInput.getConnectedGamepadTypes();
  }

  /**
   * @category Game input
   */
  static getEventsCapturedInLastUpdate(): Set<BpxGameInputEvent> {
    return this.#tryGetEngine().gameInput.getEventsCapturedInLastUpdate();
  }

  //
  // Audio API
  //

  /**
   * @category Audio
   */
  static isAudioMuted(): boolean {
    return this.#tryGetEngine().audioApi.isAudioMuted();
  }

  /**
   * @category Audio
   */
  static muteAudio(opts?: { fadeOutMillis?: number }): void {
    this.#tryGetEngine().audioApi.muteAudio(opts);
  }

  /**
   * @category Audio
   */
  static unmuteAudio(opts?: { fadeInMillis?: number }): void {
    this.#tryGetEngine().audioApi.unmuteAudio(opts);
  }

  /**
   * @category Audio
   */
  static startPlayback(
    soundUrl: BpxSoundUrl,
    opts?: {
      muteOnStart?: boolean;
      onGamePause?: "pause" | "mute" | "ignore";
    },
  ): BpxAudioPlaybackId {
    return this.#tryGetEngine().audioApi.startPlayback(soundUrl, opts);
  }

  /**
   * @category Audio
   */
  static startPlaybackLooped(
    soundUrl: BpxSoundUrl,
    opts?: {
      muteOnStart?: boolean;
      onGamePause?: "pause" | "mute" | "ignore";
    },
  ): BpxAudioPlaybackId {
    return this.#tryGetEngine().audioApi.startPlaybackLooped(soundUrl, opts);
  }

  /**
   * @category Audio
   */
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

  /**
   * @category Audio
   */
  static mutePlayback(
    playbackId: BpxAudioPlaybackId,
    opts?: { fadeOutMillis?: number },
  ): void {
    this.#tryGetEngine().audioApi.mutePlayback(playbackId, opts);
  }

  /**
   * @category Audio
   */
  static unmutePlayback(
    playbackId: BpxAudioPlaybackId,
    opts?: { fadeInMillis?: number },
  ): void {
    this.#tryGetEngine().audioApi.unmutePlayback(playbackId, opts);
  }

  /**
   * @category Audio
   */
  static stopPlayback(
    playbackId: BpxAudioPlaybackId,
    opts?: { fadeOutMillis?: number },
  ): void {
    this.#tryGetEngine().audioApi.stopPlayback(playbackId, opts);
  }

  /**
   * @category Audio
   */
  static pausePlayback(playbackId: BpxAudioPlaybackId): void {
    this.#tryGetEngine().audioApi.pausePlayback(playbackId);
  }

  /**
   * @category Audio
   */
  static resumePlayback(playbackId: BpxAudioPlaybackId): void {
    this.#tryGetEngine().audioApi.resumePlayback(playbackId);
  }

  /**
   * @category Audio
   */
  static getAudioContext(): AudioContext {
    return this.#tryGetEngine().audioApi.getAudioContext();
  }

  //
  // Full Screen
  //

  /**
   * @category Full screen
   */
  static isFullScreenSupported(): boolean {
    return this.#tryGetEngine().fullScreen.isFullScreenSupported();
  }

  /**
   * @category Full screen
   */
  static isInFullScreen(): boolean {
    return this.#tryGetEngine().fullScreen.isInFullScreen();
  }

  /**
   * @category Full screen
   */
  static toggleFullScreen(): void {
    this.#tryGetEngine().fullScreen.toggleFullScreen();
  }

  //
  // Storage API
  //

  /**
   * @category Storage
   */
  static savePersistedState<
    PersistedStateValue extends BpxPersistedStateValueConstraints,
  >(value: PersistedStateValue): void {
    this.#tryGetEngine().storageApi.savePersistedState(value);
  }

  /**
   * @category Storage
   */
  static loadPersistedState<
    PersistedStateValue extends BpxPersistedStateValueConstraints,
  >(): PersistedStateValue | null {
    return this.#tryGetEngine().storageApi.loadPersistedState();
  }

  /**
   * @category Storage
   */
  static clearPersistedState(): void {
    this.#tryGetEngine().storageApi.clearPersistedState();
  }

  //
  // Direct access to loaded assets
  //

  /**
   * @category Assets
   */
  static getImageAsset(imageUrl: BpxImageUrl): BpxImageAsset {
    return this.#tryGetEngine().assets.getImageAsset(imageUrl);
  }

  /**
   * @category Assets
   */
  static getSoundAsset(soundUrl: BpxSoundUrl): BpxSoundAsset {
    return this.#tryGetEngine().assets.getSoundAsset(soundUrl);
  }

  /**
   * @category Assets
   */
  static getJsonAsset(jsonUrl: BpxJsonUrl): BpxJsonAsset {
    return this.#tryGetEngine().assets.getJsonAsset(jsonUrl);
  }
}

/////////////////////////////////////////////////////////////////////////////

/**
 * @category API entry points
 */
export class BeetPxDraw {
  // Make sure the constructor is private:
  private constructor() {}

  static #tryGetEngine(calledFnName: string): Engine {
    if (!Engine.engineSingleton) {
      throw Error(
        `Tried to access BeetPx API without calling BeetPx.start(…) first.`,
      );
    }
    if (!Engine.engineSingleton.isInsideDrawOrStartedCallback) {
      Logger.warnBeetPx(
        `Used "${calledFnName}" outside of either "setOnDraw" or "setOnStarted" callback.`,
      );
    }
    return Engine.engineSingleton;
  }

  static clearCanvas(color: BpxRgbColor): void {
    BeetPxDraw.#tryGetEngine("clearCanvas").drawApi.clearCanvas(color);
  }

  /**
   * @returns - previous clipping region in form of an array: [xy, wh]
   */
  static setClippingRegion(
    xy: BpxVector2d,
    wh: BpxVector2d,
  ): [xy: BpxVector2d, wh: BpxVector2d] {
    return BeetPxDraw.#tryGetEngine(
      "setClippingRegion",
    ).drawApi.setClippingRegion(xy, wh);
  }

  /**
   * @returns - previous clipping region in form of an array: [xy, wh]
   */
  static removeClippingRegion(): [xy: BpxVector2d, wh: BpxVector2d] {
    return BeetPxDraw.#tryGetEngine(
      "removeClippingRegion",
    ).drawApi.removeClippingRegion();
  }

  /**
   * Sets a new XY (left-top corner) of a camera's viewport
   *
   * @returns previous camera XY
   */
  static setCameraXy(xy: BpxVector2d): BpxVector2d {
    return BeetPxDraw.#tryGetEngine("setCameraXy").drawApi.setCameraXy(xy);
  }

  /**
   * @returns previous pattern
   */
  static setDrawingPattern(pattern: BpxDrawingPattern): BpxDrawingPattern {
    return BeetPxDraw.#tryGetEngine(
      "setDrawingPattern",
    ).drawApi.setDrawingPattern(pattern);
  }

  static pixel(xy: BpxVector2d, color: BpxRgbColor): void {
    BeetPxDraw.#tryGetEngine("pixel").drawApi.drawPixel(xy, color);
  }

  /**
   * Draws pixels based on a visual 2d representation in form of rows
   *   (designated by new lines) where `#` and `-` stand for a colored
   *   pixel and a lack of a pixel. Whitespaces are ignored.
   */
  static pixels(
    pixels: BpxPixels,
    xy: BpxVector2d,
    color: BpxRgbColor,
    opts?: {
      centerXy?: [boolean, boolean];
      scaleXy?: BpxVector2d;
      flipXy?: [boolean, boolean];
    },
  ): void {
    BeetPxDraw.#tryGetEngine("pixels").drawApi.drawPixels(
      pixels,
      xy,
      color,
      opts,
    );
  }

  static line(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    BeetPxDraw.#tryGetEngine("line").drawApi.drawLine(xy, wh, color);
  }

  static rect(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    BeetPxDraw.#tryGetEngine("rect").drawApi.drawRect(xy, wh, color);
  }

  static rectFilled(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    BeetPxDraw.#tryGetEngine("rectFilled").drawApi.drawRectFilled(
      xy,
      wh,
      color,
    );
  }

  static rectOutsideFilled(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    BeetPxDraw.#tryGetEngine("rectOutsideFilled").drawApi.drawRectOutsideFilled(
      xy,
      wh,
      color,
    );
  }

  static ellipse(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    BeetPxDraw.#tryGetEngine("ellipse").drawApi.drawEllipse(xy, wh, color);
  }

  static ellipseFilled(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    BeetPxDraw.#tryGetEngine("ellipseFilled").drawApi.drawEllipseFilled(
      xy,
      wh,
      color,
    );
  }

  static ellipseOutsideFilled(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    BeetPxDraw.#tryGetEngine(
      "ellipseOutsideFilled",
    ).drawApi.drawEllipseOutsideFilled(xy, wh, color);
  }

  /**
   * @returns previous sprite color mapping
   */
  static setSpriteColorMapping(
    spriteColorMapping: BpxSpriteColorMapping,
  ): BpxSpriteColorMapping {
    return BeetPxDraw.#tryGetEngine(
      "setSpriteColorMapping",
    ).drawApi.setSpriteColorMapping(spriteColorMapping);
  }

  static sprite(
    sprite: BpxSprite | BpxAnimatedSprite,
    xy: BpxVector2d,
    opts?: {
      centerXy?: [boolean, boolean];
      scaleXy?: BpxVector2d;
      flipXy?: [boolean, boolean];
    },
  ): void {
    BeetPxDraw.#tryGetEngine("sprite").drawApi.drawSprite(sprite, xy, opts);
  }

  /**
   * @category Fonts
   * @returns - previously used font
   */
  static setFont(font: BpxFont): BpxFont {
    return BeetPxDraw.#tryGetEngine("setFont").drawApi.setFont(font);
  }

  /**
   * @returns - previously used color markers
   */
  static setTextColorMarkers(
    textColorMarkers: BpxTextColorMarkers,
  ): BpxTextColorMarkers {
    return BeetPxDraw.#tryGetEngine(
      "setTextColorMarkers",
    ).drawApi.setTextColorMarkers(textColorMarkers);
  }

  static measureText(
    text: string,
    opts?: {
      centerXy?: [boolean, boolean];
      scaleXy?: BpxVector2d;
    },
  ): BpxTextMeasurement {
    return BeetPxDraw.#tryGetEngine("measureText").drawApi.measureText(
      text,
      opts,
    );
  }

  static text(
    text: string,
    xy: BpxVector2d,
    color: BpxRgbColor,
    opts?: {
      centerXy?: [boolean, boolean];
      scaleXy?: BpxVector2d;
    },
  ): void {
    BeetPxDraw.#tryGetEngine("text").drawApi.drawText(text, xy, color, opts);
  }

  static takeCanvasSnapshot(): void {
    BeetPxDraw.#tryGetEngine("takeCanvasSnapshot").drawApi.takeCanvasSnapshot();
  }
}

/////////////////////////////////////////////////////////////////////////////

/**
 * @category API entry points
 */
export class BeetPxUtils {
  // Make sure the constructor is private:
  private constructor() {}

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
  static assertUnreachable(
    thingThatShouldBeOfTypeNeverAtThisPoint: never,
  ): void {
    assertUnreachable(thingThatShouldBeOfTypeNeverAtThisPoint);
  }

  static booleanChangingEveryNthFrame(
    n: number,
    opts?: { onGamePause?: "pause" | "ignore" },
  ): boolean {
    return booleanChangingEveryNthFrame(n, opts);
  }

  /**
   * Returns the middle number. Example usage: `clamp(min, value, max)`
   *   in order to find a value which is:
   *   - `value` if it is `>= min` and `<= max`
   *   - `min` if `value` is `< min`
   *   - `max` if `value` is `> max`
   */
  static clamp(a: number, b: number, c: number): number {
    return clamp(a, b, c);
  }

  static drawTextWithOutline(
    text: string,
    canvasXy1: BpxVector2d,
    textColor: BpxRgbColor,
    outlineColor: BpxRgbColor,
    opts?: {
      centerXy?: [boolean, boolean];
      scaleXy?: BpxVector2d;
    },
  ): void {
    drawTextWithOutline(text, canvasXy1, textColor, outlineColor, opts);
  }

  static identity<Param>(param: Param): Param {
    return identity(param);
  }

  static lerp(
    a: number,
    b: number,
    t: number,
    opts?: { clamp?: boolean },
  ): number {
    return lerp(a, b, t, opts);
  }

  /**
   * a modulo operation – in contrary to native `%`, this returns results from [0, n) range (positive values only)
   */
  static mod(value: number, modulus: number): number {
    return mod(value, modulus);
  }

  static noop(): void {}

  /**
   * Generates a list of XY to add to a given coordinate in order to get all offsets by 1 pixel in 4 directions.
   */
  static offset4Directions(): [
    BpxVector2d,
    BpxVector2d,
    BpxVector2d,
    BpxVector2d,
  ] {
    return offset4Directions();
  }

  /**
   * Generates a list of XY to add to a given coordinate in order to get all offsets by 1 pixel in 8 directions.
   */
  static offset8Directions(): [
    BpxVector2d,
    BpxVector2d,
    BpxVector2d,
    BpxVector2d,
    BpxVector2d,
    BpxVector2d,
    BpxVector2d,
    BpxVector2d,
  ] {
    return offset8Directions();
  }

  static randomElementOf<TElement>(array: TElement[]): TElement | undefined {
    return randomElementOf<TElement>(array);
  }

  static range(n: number): number[] {
    return range(n);
  }

  static repeatEachElement<TElement>(
    times: number,
    array: TElement[],
  ): TElement[] {
    return repeatEachElement(times, array);
  }

  /**
   * To be used as a value, e.g. in `definedValue: maybeUndefined() ?? throwError("…")`.
   */
  static throwError(message: string): never {
    throwError(message);
  }

  /**
   * @return turn angle. A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
   */
  static trigAtan2(x: number, y: number): number {
    return trigAtan2(x, y);
  }

  /**
   * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
   */
  static trigCos(turnAngle: number): number {
    return trigCos(turnAngle);
  }

  /**
   * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
   */
  static trigSin(turnAngle: number): number {
    return trigSin(turnAngle);
  }
}

/////////////////////////////////////////////////////////////////////////////

export type { BpxEngineConfig } from "./Engine";
export type {
  BpxImageAsset,
  BpxImageUrl,
  BpxJsonAsset,
  BpxJsonUrl,
  BpxSoundAsset,
  BpxSoundUrl,
} from "./assets/Assets";
export type { BpxAudioPlaybackId } from "./audio/AudioPlayback";
export type {
  BpxSoundSequence,
  BpxSoundSequenceEntry,
} from "./audio/SoundSequence";
export type { BpxBrowserType } from "./browser/BrowserTypeDetector";
export type { BpxColorMapper } from "./color/ColorMapper";
export type { BpxRgbCssHex } from "./color/RgbColor";
export type {
  BpxArrangedGlyph,
  BpxFontConfig,
  BpxGlyph,
  BpxKerningPrevCharMap,
  BpxTextColorMarkers,
} from "./font/Font";
export type { BpxGameInputEvent } from "./game_input/GameInput";
export type { BpxGamepadType } from "./game_input/GameInputGamepad";
export type { BpxGameButtonName } from "./game_input/buttons/GameButtons";
export type { BpxEasingFn } from "./misc/Easing";
export type { BpxImageBoundAnimatedSpriteFactory } from "./sprite/AnimatedSprite";
export type { BpxImageBoundSpriteFactory } from "./sprite/Sprite";

/////////////////////////////////////////////////////////////////////////////

export { BpxCanvasSnapshotColorMapping } from "./color/CanvasSnapshotColorMapping";
export { BpxPalettePico8 } from "./color/PalettePico8";
export { BpxPatternColors } from "./color/PatternColors";
export { BpxRgbColor } from "./color/RgbColor";
export { BpxSpriteColorMapping } from "./color/SpriteColorMapping";
export { BpxDrawingPattern } from "./draw_api/DrawingPattern";
export { BpxPixels } from "./draw_api/Pixels";
export { BpxFont } from "./font/Font";
export { BpxFontConfigPico8 } from "./font/FontConfigPico8";
export { BpxFontConfigSaint11Minimal4 } from "./font/FontConfigSaint11Minimal4";
export { BpxFontConfigSaint11Minimal5 } from "./font/FontConfigSaint11Minimal5";
export { BpxGamepadTypeDetector } from "./game_input/GamepadTypeDetector";
export { BpxEasing } from "./misc/Easing";
export { BpxVector2d } from "./misc/Vector2d";
export { BpxAnimatedSprite } from "./sprite/AnimatedSprite";
export { BpxSprite } from "./sprite/Sprite";
export { BpxTimer } from "./timer/Timer";
export { BpxTimerSequence } from "./timer/TimerSequence";

/////////////////////////////////////////////////////////////////////////////

export const $ = BeetPx;
export const $d = BeetPxDraw;
export const $u = BeetPxUtils;

/////////////////////////////////////////////////////////////////////////////

export * from "./shorthands";
