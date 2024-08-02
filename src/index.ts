/**
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
import type {
  BpxSoundSequence,
  BpxSoundSequenceEntry,
} from "./audio/SoundSequence";
import type { BpxBrowserType } from "./browser/BrowserTypeDetector";
import type { BpxColorMapper } from "./color/ColorMapper";
import type { BpxRgbCssHex } from "./color/RgbColor";
import type { BpxTextMeasurement } from "./draw_api/DrawApi";
import type {
  BpxArrangedGlyph,
  BpxGlyph,
  BpxKerningPrevCharMap,
  BpxTextColorMarkers,
} from "./font/Font";
import type {
  BpxGameInputEvent,
  GameInputMethod,
} from "./game_input/GameInput";
import type { BpxGamepadType } from "./game_input/GameInputGamepad";
import type { BpxGameButtonName } from "./game_input/buttons/GameButtons";
import type { BpxImageBoundAnimatedSpriteFactory } from "./sprite/AnimatedSprite";
import type { BpxImageBoundSpriteFactory } from "./sprite/Sprite";
import type { BpxPersistedStateValueConstraints } from "./storage/StorageApi";

/////////////////////////////////////////////////////////////////////////////

import { Engine } from "./Engine";
import { BpxCanvasSnapshotColorMapping } from "./color/CanvasSnapshotColorMapping";
import { BpxPalettePico8 } from "./color/PalettePico8";
import { BpxPatternColors } from "./color/PatternColors";
import { BpxRgbColor } from "./color/RgbColor";
import { BpxSpriteColorMapping } from "./color/SpriteColorMapping";
import { DebugMode } from "./debug/DebugMode";
import { BpxDrawingPattern } from "./draw_api/DrawingPattern";
import { BpxPixels } from "./draw_api/Pixels";
import { BpxFont, BpxFontConfig } from "./font/Font";
import { BpxFontConfigPico8 } from "./font/FontConfigPico8";
import { BpxFontConfigSaint11Minimal4 } from "./font/FontConfigSaint11Minimal4";
import { BpxFontConfigSaint11Minimal5 } from "./font/FontConfigSaint11Minimal5";
import { BpxGamepadTypeDetector } from "./game_input/GamepadTypeDetector";
import { Logger } from "./logger/Logger";
import { BpxEasing, BpxEasingFn } from "./misc/Easing";
import { BpxVector2d } from "./misc/Vector2d";
import { GamePause } from "./pause/GamePause";
import { BpxAnimatedSprite } from "./sprite/AnimatedSprite";
import { BpxSprite } from "./sprite/Sprite";
import { BpxTimer } from "./timer/Timer";
import { BpxTimerSequence } from "./timer/TimerSequence";
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
   * TODO: docs
   *
   * @notExported
   * @categoryTODO Globals
   */
  const BEETPX__IS_PROD: boolean;
  /**
   * TODO: docs
   *
   * @notExported
   * @categoryTODO Globals
   */
  const BEETPX__VERSION: string;
}

/////////////////////////////////////////////////////////////////////////////

/**
 * One of 3 main API entry points. This one provides you with the most of
 * the BeetPx capabilities, except drawing.
 *
 * @example
 * ```ts
 * BeetPx.setOnUpdate(() => {
 *   BeetPx.logInfo(BeetPx.isAnyButtonPressed());
 * });
 * ```
 *
 * @category API entry points
 */
export class BeetPx {
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
   * TODO: docs
   *
   * @categoryTODO Lifecycle
   */
  static async start(config: BpxEngineConfig): Promise<void> {
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

  /**
   * TODO: docs
   */
  static get debug(): boolean {
    return DebugMode.enabled;
  }

  /**
   * TODO: docs
   */
  static get canvasSize(): BpxVector2d {
    return this.#tryGetEngine().canvasSize;
  }

  /**
   * TODO: docs
   *
   * Number of frames processed since game started.
   * It gets reset to 0 when `BeetPx.restart()` is called.
   * It counts update calls, not draw calls.
   *
   * @returns number
   */
  static get frameNumber(): number {
    return this.#tryGetEngine().frameNumber;
  }

  /**
   * TODO: docs
   */
  static get frameNumberOutsidePause(): number {
    return this.#tryGetEngine().frameNumberOutsidePause;
  }

  /**
   * TODO: docs
   */
  static get renderingFps(): number {
    return this.#tryGetEngine().renderingFps;
  }

  /**
   * TODO: docs
   */
  static get detectedBrowserType(): BpxBrowserType {
    return this.#tryGetEngine().detectedBrowserType;
  }

  //
  // lifecycle methods
  //

  /**
   * TODO: docs
   *
   * @categoryTODO Lifecycle
   */
  static setOnStarted(onStarted?: () => void): void {
    if (Engine.engineSingleton) {
      Engine.engineSingleton.setOnStarted(onStarted);
    } else {
      this.#dataStoredBeforeEngineStarted.onStarted = onStarted;
    }
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Lifecycle
   */
  static setOnUpdate(onUpdate?: () => void): void {
    if (Engine.engineSingleton) {
      Engine.engineSingleton.setOnUpdate(onUpdate);
    } else {
      this.#dataStoredBeforeEngineStarted.onUpdate = onUpdate;
    }
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Lifecycle
   */
  static setOnDraw(onDraw?: () => void): void {
    if (Engine.engineSingleton) {
      Engine.engineSingleton.setOnDraw(onDraw);
    } else {
      this.#dataStoredBeforeEngineStarted.onDraw = onDraw;
    }
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Lifecycle
   */
  static restart(): void {
    this.#tryGetEngine().restart();
  }

  //
  // Logger
  //

  /**
   * TODO: docs
   *
   * @categoryTODO Logging
   */
  static logDebug(...args: unknown[]): void {
    Logger.debug(...args);
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Logging
   */
  static logInfo(...args: unknown[]): void {
    Logger.info(...args);
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Logging
   */
  static logWarn(...args: unknown[]): void {
    Logger.warn(...args);
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Logging
   */
  static logError(...args: unknown[]): void {
    Logger.error(...args);
  }

  //
  // Game Pause
  //

  /**
   * TODO: docs
   *
   * @categoryTODO Game pause
   */
  static get isPaused(): boolean {
    return GamePause.isActive;
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Game pause
   */
  static get wasJustPaused(): boolean {
    return GamePause.wasJustActivated;
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Game pause
   */
  static get wasJustResumed(): boolean {
    return GamePause.wasJustDeactivated;
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Game pause
   */
  static pause(): void {
    GamePause.activate();
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Game pause
   */
  static resume(): void {
    GamePause.deactivate();
  }

  //
  // Game input
  //

  /**
   * TODO: docs
   *
   * @categoryTODO Game input
   */
  static wasAnyButtonJustPressed(): boolean {
    return this.#tryGetEngine().gameInput.gameButtons.wasAnyJustPressed();
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Game input
   */
  static wasButtonJustPressed(button: BpxGameButtonName): boolean {
    return this.#tryGetEngine().gameInput.gameButtons.wasJustPressed(button);
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Game input
   */
  static wasButtonJustReleased(button: BpxGameButtonName): boolean {
    return this.#tryGetEngine().gameInput.gameButtons.wasJustReleased(button);
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Game input
   */
  static isAnyButtonPressed(): boolean {
    return this.#tryGetEngine().gameInput.gameButtons.isAnyPressed();
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Game input
   */
  static isButtonPressed(button: BpxGameButtonName): boolean {
    return this.#tryGetEngine().gameInput.gameButtons.isPressed(button);
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Game input
   * @example
   * ```ts
   * this.position += $.getPressedDirection().mul(this.speed);
   * ```
   */
  static getPressedDirection(): BpxVector2d {
    return this.#tryGetEngine().gameInput.gameButtons.getPressedDirection();
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Game input
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
   * TODO: docs
   *
   * @categoryTODO Game input
   */
  static getRecentInputMethods(): Set<GameInputMethod> {
    return this.#tryGetEngine().gameInput.getRecentInputMethods();
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Game input
   */
  static getConnectedGamepadTypes(): Set<BpxGamepadType> {
    return this.#tryGetEngine().gameInput.getConnectedGamepadTypes();
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Game input
   */
  static getEventsCapturedInLastUpdate(): Set<BpxGameInputEvent> {
    return this.#tryGetEngine().gameInput.getEventsCapturedInLastUpdate();
  }

  //
  // Audio API
  //

  /**
   * TODO: docs
   *
   * @categoryTODO Audio
   */
  static isAudioMuted(): boolean {
    return this.#tryGetEngine().audioApi.isAudioMuted();
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Audio
   */
  static muteAudio(opts?: { fadeOutMillis?: number }): void {
    this.#tryGetEngine().audioApi.muteAudio(opts);
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Audio
   */
  static unmuteAudio(opts?: { fadeInMillis?: number }): void {
    this.#tryGetEngine().audioApi.unmuteAudio(opts);
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Audio
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
   * TODO: docs
   *
   * @categoryTODO Audio
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
   * TODO: docs
   *
   * @categoryTODO Audio
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
   * TODO: docs
   *
   * @categoryTODO Audio
   */
  static mutePlayback(
    playbackId: BpxAudioPlaybackId,
    opts?: { fadeOutMillis?: number },
  ): void {
    this.#tryGetEngine().audioApi.mutePlayback(playbackId, opts);
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Audio
   */
  static unmutePlayback(
    playbackId: BpxAudioPlaybackId,
    opts?: { fadeInMillis?: number },
  ): void {
    this.#tryGetEngine().audioApi.unmutePlayback(playbackId, opts);
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Audio
   */
  static stopPlayback(
    playbackId: BpxAudioPlaybackId,
    opts?: { fadeOutMillis?: number },
  ): void {
    this.#tryGetEngine().audioApi.stopPlayback(playbackId, opts);
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Audio
   */
  static pausePlayback(playbackId: BpxAudioPlaybackId): void {
    this.#tryGetEngine().audioApi.pausePlayback(playbackId);
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Audio
   */
  static resumePlayback(playbackId: BpxAudioPlaybackId): void {
    this.#tryGetEngine().audioApi.resumePlayback(playbackId);
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Audio
   */
  static getAudioContext(): AudioContext {
    return this.#tryGetEngine().audioApi.getAudioContext();
  }

  //
  // Full Screen
  //

  /**
   * TODO: docs
   *
   * @categoryTODO Full screen
   */
  static isFullScreenSupported(): boolean {
    return this.#tryGetEngine().fullScreen.isFullScreenSupported();
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Full screen
   */
  static isInFullScreen(): boolean {
    return this.#tryGetEngine().fullScreen.isInFullScreen();
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Full screen
   */
  static toggleFullScreen(): void {
    this.#tryGetEngine().fullScreen.toggleFullScreen();
  }

  //
  // Storage API
  //

  /**
   * TODO: docs
   *
   * @categoryTODO Storage
   */
  static savePersistedState<
    PersistedStateValue extends BpxPersistedStateValueConstraints,
  >(value: PersistedStateValue): void {
    this.#tryGetEngine().storageApi.savePersistedState(value);
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Storage
   */
  static loadPersistedState<
    PersistedStateValue extends BpxPersistedStateValueConstraints,
  >(): PersistedStateValue | null {
    return this.#tryGetEngine().storageApi.loadPersistedState();
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Storage
   */
  static clearPersistedState(): void {
    this.#tryGetEngine().storageApi.clearPersistedState();
  }

  //
  // Direct access to loaded assets
  //

  /**
   * TODO: docs
   *
   * @categoryTODO Assets
   */
  static getImageAsset(imageUrl: BpxImageUrl): BpxImageAsset {
    return this.#tryGetEngine().assets.getImageAsset(imageUrl);
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Assets
   */
  static getSoundAsset(soundUrl: BpxSoundUrl): BpxSoundAsset {
    return this.#tryGetEngine().assets.getSoundAsset(soundUrl);
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Assets
   */
  static getJsonAsset(jsonUrl: BpxJsonUrl): BpxJsonAsset {
    return this.#tryGetEngine().assets.getJsonAsset(jsonUrl);
  }
}

/////////////////////////////////////////////////////////////////////////////

/**
 * One of 3 main API entry points. This one provides you with the drawing
 * capabilities. Its methods are supposed to be called from either inside
 * {@link BeetPx.setOnStarted} or {@link BeetPx.setOnDraw} callback.
 *
 * @example
 * ```ts
 * BeetPx.setOnDraw(() => {
 *   BeetPxDraw.rectFilled($v(10), $v(20), $rgb_red);
 * });
 * ```
 *
 * @category API entry points
 */
export class BeetPxDraw {
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

  /**
   * TODO: docs
   */
  static clearCanvas(color: BpxRgbColor): void {
    BeetPxDraw.#tryGetEngine("clearCanvas").drawApi.clearCanvas(color);
  }

  /**
   * TODO: docs
   *
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
   * TODO: docs
   *
   * @returns - previous clipping region in form of an array: [xy, wh]
   */
  static removeClippingRegion(): [xy: BpxVector2d, wh: BpxVector2d] {
    return BeetPxDraw.#tryGetEngine(
      "removeClippingRegion",
    ).drawApi.removeClippingRegion();
  }

  /**
   * TODO: docs
   *
   * Sets a new XY (left-top corner) of a camera's viewport
   *
   * @returns previous camera XY
   */
  static setCameraXy(xy: BpxVector2d): BpxVector2d {
    return BeetPxDraw.#tryGetEngine("setCameraXy").drawApi.setCameraXy(xy);
  }

  /**
   * TODO: docs
   *
   * @returns previous pattern
   */
  static setDrawingPattern(pattern: BpxDrawingPattern): BpxDrawingPattern {
    return BeetPxDraw.#tryGetEngine(
      "setDrawingPattern",
    ).drawApi.setDrawingPattern(pattern);
  }

  /**
   * TODO: docs
   */
  static pixel(xy: BpxVector2d, color: BpxRgbColor): void {
    BeetPxDraw.#tryGetEngine("pixel").drawApi.drawPixel(xy, color);
  }

  /**
   * TODO: docs
   *
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

  /**
   * TODO: docs
   */
  static line(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    BeetPxDraw.#tryGetEngine("line").drawApi.drawLine(xy, wh, color);
  }

  /**
   * TODO: docs
   */
  static rect(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    BeetPxDraw.#tryGetEngine("rect").drawApi.drawRect(xy, wh, color);
  }

  /**
   * TODO: docs
   */
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

  /**
   * TODO: docs
   */
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

  /**
   * TODO: docs
   */
  static ellipse(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    BeetPxDraw.#tryGetEngine("ellipse").drawApi.drawEllipse(xy, wh, color);
  }

  /**
   * TODO: docs
   */
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

  /**
   * TODO: docs
   */
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
   * TODO: docs
   *
   * @returns previous sprite color mapping
   */
  static setSpriteColorMapping(
    spriteColorMapping: BpxSpriteColorMapping,
  ): BpxSpriteColorMapping {
    return BeetPxDraw.#tryGetEngine(
      "setSpriteColorMapping",
    ).drawApi.setSpriteColorMapping(spriteColorMapping);
  }

  /**
   * TODO: docs
   */
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
   * TODO: docs
   *
   * @categoryTODO Fonts
   * @returns - previously used font
   */
  static setFont(font: BpxFont): BpxFont {
    return BeetPxDraw.#tryGetEngine("setFont").drawApi.setFont(font);
  }

  /**
   * TODO: docs
   *
   * @returns - previously used color markers
   */
  static setTextColorMarkers(
    textColorMarkers: BpxTextColorMarkers,
  ): BpxTextColorMarkers {
    return BeetPxDraw.#tryGetEngine(
      "setTextColorMarkers",
    ).drawApi.setTextColorMarkers(textColorMarkers);
  }

  /**
   * TODO: docs
   */
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

  /**
   * TODO: docs
   */
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

  /**
   * TODO: docs
   */
  static takeCanvasSnapshot(): void {
    BeetPxDraw.#tryGetEngine("takeCanvasSnapshot").drawApi.takeCanvasSnapshot();
  }
}

/////////////////////////////////////////////////////////////////////////////

/**
 * One of 3 main API entry points. This one provides you with the useful
 * utils.
 *
 * @example
 * ```ts
 * BeetPxUtils.clamp($v_0_0, this.playerXy, BeetPx.canvasSize);
 * ```
 *
 * @category API entry points
 */
export class BeetPxUtils {
  private constructor() {}

  /**
   * TODO: docs
   *
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

  /**
   * TODO: docs
   */
  static booleanChangingEveryNthFrame(
    n: number,
    opts?: { onGamePause?: "pause" | "ignore" },
  ): boolean {
    return booleanChangingEveryNthFrame(n, opts);
  }

  /**
   * TODO: docs
   *
   * Returns the middle number. Example usage: `clamp(min, value, max)`
   *   in order to find a value which is:
   *   - `value` if it is `>= min` and `<= max`
   *   - `min` if `value` is `< min`
   *   - `max` if `value` is `> max`
   */
  static clamp(a: number, b: number, c: number): number {
    return clamp(a, b, c);
  }

  /**
   * TODO: docs
   */
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

  /**
   * TODO: docs
   */
  static identity<Param>(param: Param): Param {
    return identity(param);
  }

  /**
   * TODO: docs
   */
  static lerp(
    a: number,
    b: number,
    t: number,
    opts?: { clamp?: boolean },
  ): number {
    return lerp(a, b, t, opts);
  }

  /**
   * TODO: docs
   *
   * a modulo operation – in contrary to native `%`, this returns results from [0, n) range (positive values only)
   */
  static mod(value: number, modulus: number): number {
    return mod(value, modulus);
  }

  /**
   * TODO: docs
   */
  static noop(): void {}

  /**
   * TODO: docs
   *
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
   * TODO: docs
   *
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

  /**
   * TODO: docs
   */
  static randomElementOf<TElement>(array: TElement[]): TElement | undefined {
    return randomElementOf<TElement>(array);
  }

  /**
   * TODO: docs
   */
  static range(n: number): number[] {
    return range(n);
  }

  /**
   * TODO: docs
   */
  static repeatEachElement<TElement>(
    times: number,
    array: TElement[],
  ): TElement[] {
    return repeatEachElement(times, array);
  }

  /**
   * TODO: docs
   *
   * To be used as a value, e.g. in `definedValue: maybeUndefined() ?? throwError("…")`.
   */
  static throwError(message: string): never {
    throwError(message);
  }

  /**
   * TODO: docs
   *
   * @returns turn angle. A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
   */
  static trigAtan2(x: number, y: number): number {
    return trigAtan2(x, y);
  }

  /**
   * TODO: docs
   *
   * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
   */
  static trigCos(turnAngle: number): number {
    return trigCos(turnAngle);
  }

  /**
   * TODO: docs
   *
   * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
   */
  static trigSin(turnAngle: number): number {
    return trigSin(turnAngle);
  }
}

/////////////////////////////////////////////////////////////////////////////

export type {
  BpxArrangedGlyph,
  BpxAudioPlaybackId,
  BpxBrowserType,
  BpxColorMapper,
  BpxEasingFn,
  BpxEngineConfig,
  BpxFontConfig,
  BpxGameButtonName,
  BpxGameInputEvent,
  BpxGamepadType,
  BpxGlyph,
  BpxImageAsset,
  BpxImageBoundAnimatedSpriteFactory,
  BpxImageBoundSpriteFactory,
  BpxImageUrl,
  BpxJsonAsset,
  BpxJsonUrl,
  BpxKerningPrevCharMap,
  BpxPersistedStateValueConstraints,
  BpxRgbCssHex,
  BpxSoundAsset,
  BpxSoundSequence,
  BpxSoundSequenceEntry,
  BpxSoundUrl,
  BpxTextColorMarkers,
};

/////////////////////////////////////////////////////////////////////////////

export {
  BpxAnimatedSprite,
  BpxCanvasSnapshotColorMapping,
  BpxDrawingPattern,
  BpxEasing,
  BpxFont,
  BpxFontConfigPico8,
  BpxFontConfigSaint11Minimal4,
  BpxFontConfigSaint11Minimal5,
  BpxGamepadTypeDetector,
  BpxPalettePico8,
  BpxPatternColors,
  BpxPixels,
  BpxRgbColor,
  BpxSprite,
  BpxSpriteColorMapping,
  BpxTimer,
  BpxTimerSequence,
  BpxVector2d,
};

/////////////////////////////////////////////////////////////////////////////

/**
 * A shorthand for {@link BeetPx}.
 *
 * @category API entry points
 */
export const $ = BeetPx;
/**
 * A shorthand for {@link BeetPxDraw}.
 *
 * @category API entry points
 */
export const $d = BeetPxDraw;
/**
 * A shorthand for {@link BeetPxUtils}.
 *
 * @category API entry points
 */
export const $u = BeetPxUtils;

/////////////////////////////////////////////////////////////////////////////

export * from "./shorthands";
