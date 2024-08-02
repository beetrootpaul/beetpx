/**
 * @module API
 */

//
// NOTE: Shape of this file and the way things are defined (props vs methods vs static etc.)
//       is carefully picked in order to achieve a given end result in how the docs generated
//       by TypeDoc looks like.
//

/////////////////////////////////////////////////////////////////////////////

declare global {
  interface Window {
    BEETPX__IS_PROD: boolean;
    BEETPX__VERSION: string;
  }

  /**
   * A constant injected into global namespace during the build process.
   * Indicates whether the build is meant to be used for production
   * deployment (when run with `beetpx build`) or for development purposes
   * (when run with `beetpx dev`).
   *
   * @example
   * ```ts
   * $.start({
   *   // ...,
   *   requireConfirmationOnTabClose: BEETPX__IS_PROD,
   *   debugMode: {
   *     available: !BEETPX__IS_PROD,
   *   },
   *   frameByFrame: {
   *     available: !BEETPX__VERSION,
   *   },
   * });
   * ```
   *
   * @notExported
   * @category Globals
   */
  const BEETPX__IS_PROD: boolean;

  /**
   * A constant injected into global namespace during the build process.
   * Holds a version string of a BeetPx the game was built with.
   *
   * @example
   * ```ts
   * $.logDebug(`BeetPx version: ${BEETPX__VERSION}`);
   * ```
   *
   * @notExported
   * @category Globals
   */
  const BEETPX__VERSION: string;
}

/////////////////////////////////////////////////////////////////////////////

export type { BpxAssetsToLoad } from "./assets/AssetLoader";
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
  BpxSoundSequenceEntrySoundAdditional,
  BpxSoundSequenceEntrySoundMain,
} from "./audio/SoundSequence";
export type { BpxBrowserType } from "./browser/BrowserTypeDetector";
export type { BpxCanvasSnapshot } from "./canvas/CanvasSnapshot";
export type { BpxColorMapper } from "./color/ColorMapper";
export type { BpxRgbCssHex } from "./color/RgbColor";
export type { BpxFpsDisplayPlacement } from "./debug/FpsDisplay";
export type { BpxPrintDebug } from "./debug/PrintDebug";
export type { BpxTextMeasurement } from "./draw_api/DrawApi";
export type { BpxEngineConfig } from "./Engine";
export type {
  BpxArrangedGlyph,
  BpxFontConfig,
  BpxGlyph,
  BpxKerningPrevSegmentMap,
  BpxTextColorMarkers,
} from "./font/Font";
export type { BpxGameButtonName } from "./game_input/buttons/GameButtons";
export type {
  BpxGameInputEvent,
  BpxGameInputMethod,
} from "./game_input/GameInput";
export type { BpxGamepadType } from "./game_input/GameInputGamepad";
export type { BpxImageBoundAnimatedSpriteFactory } from "./sprite/AnimatedSprite";
export type { BpxImageBoundSpriteFactory } from "./sprite/Sprite";
export type { BpxPersistedStateValueConstraints } from "./storage/StorageApi";

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
export { BpxEasing, BpxEasingFn } from "./misc/Easing";
export { BpxVector2d } from "./misc/Vector2d";
export { BpxAnimatedSprite } from "./sprite/AnimatedSprite";
export { BpxSprite } from "./sprite/Sprite";
export { BpxTimer } from "./timer/Timer";
export { BpxTimerSequence } from "./timer/TimerSequence";

/////////////////////////////////////////////////////////////////////////////

export { $, BeetPx } from "./BeetPx";
export { $d, BeetPxDraw } from "./BeetPxDraw";
export { $u, BeetPxUtils } from "./BeetPxUtils";

/////////////////////////////////////////////////////////////////////////////

export * from "./shorthands";

/////////////////////////////////////////////////////////////////////////////
