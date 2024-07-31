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
export type { BpxEngineConfig } from "./Engine";
export type {
  BpxArrangedGlyph,
  BpxFontConfig,
  BpxGlyph,
  BpxKerningPrevCharMap,
  BpxTextColorMarkers,
} from "./font/Font";
export type { BpxGameButtonName } from "./game_input/buttons/GameButtons";
export type { BpxGameInputEvent } from "./game_input/GameInput";
export type { BpxGamepadType } from "./game_input/GameInputGamepad";
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

export { $, $d, $u, BeetPx, BeetPxDraw, BeetPxUtils } from "./BeetPx";

/////////////////////////////////////////////////////////////////////////////

export * from "./shorthands";
