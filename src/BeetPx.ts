//
// NOTE: Shape of this file and the way things are defined (props vs methods vs static etc.)
//       is carefully picked in order to achieve a given end result in how the docs generated
//       by TypeDoc looks like.
//

import type { BpxEngineConfig } from "./Engine";
import { Engine } from "./Engine";
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
import { DebugMode } from "./debug/DebugMode";
import type {
  BpxGameInputEvent,
  GameInputMethod,
} from "./game_input/GameInput";
import type { BpxGamepadType } from "./game_input/GameInputGamepad";
import type { BpxGameButtonName } from "./game_input/buttons/GameButtons";
import { Logger } from "./logger/Logger";
import { BpxVector2d } from "./misc/Vector2d";
import { GamePause } from "./pause/GamePause";
import type { BpxPersistedStateValueConstraints } from "./storage/StorageApi";

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
   * A set of game input events captures since the last game loop iteration.
   *
   * Typically you wouldn't need to use those this method unless dealing
   * with custom even handling.
   *
   * @category Game input
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
 * A shorthand for {@link BeetPx}.
 *
 * @category API entry points
 */
export const $ = BeetPx;

/////////////////////////////////////////////////////////////////////////////
