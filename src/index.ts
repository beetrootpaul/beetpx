declare global {
  /**
   * Note: the generated documentation marks this variable as "Not Exported".
   *   This is *not* true.
   *
   * @notExported
   */
  interface Window {
    BEETPX__IS_PROD: boolean;
    BEETPX__VERSION: string;
  }

  /**
   * Note: This constant is labelled as "Not Exported" in these docs. It is not true.
   *       We had to mark this constant with `@notExported` only to trick `typedoc`
   *       into including in these docs here.
   *
   * @notExported
   */
  const BEETPX__IS_PROD: boolean;
  /**
   * Note: This constant is labelled as "Not Exported" in these docs. It is not true.
   *       We had to mark this constant with `@notExported` only to trick `typedoc`
   *       into including in these docs here.
   *
   * @notExported
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

export { $, $d, $u, BeetPx } from "./BeetPx";

/////////////////////////////////////////////////////////////////////////////

export * from "./shorthands";
