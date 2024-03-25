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

export { type BpxEngineConfig } from "./Engine";
export {
  type BpxImageAsset,
  type BpxImageUrl,
  type BpxJsonAsset,
  type BpxJsonUrl,
  type BpxSoundAsset,
  type BpxSoundUrl,
} from "./assets/Assets";
export { type BpxAudioPlaybackId } from "./audio/AudioPlayback";
export {
  type BpxSoundSequence,
  type BpxSoundSequenceEntry,
} from "./audio/SoundSequence";
export { type BpxBrowserType } from "./browser/BrowserTypeDetector";
export { BpxCanvasSnapshotColorMapping } from "./color/CanvasSnapshotColorMapping";
export { type BpxColorMapper } from "./color/ColorMapper";
export { BpxPatternColors } from "./color/PatternColors";
export { BpxRgbColor, type BpxRgbCssHex } from "./color/RgbColor";
export { BpxSpriteColorMapping } from "./color/SpriteColorMapping";
export { BpxDrawingPattern } from "./draw_api/DrawingPattern";
export { BpxPixels } from "./draw_api/Pixels";
export {
  BpxFont,
  type BpxArrangedGlyph,
  type BpxGlyph,
  type BpxKerningPrevCharMap,
  type BpxTextColorMarkers,
} from "./font/Font";
export { BpxFontPico8 } from "./font/FontPico8";
export { BpxFontSaint11Minimal4 } from "./font/FontSaint11Minimal4";
export { BpxFontSaint11Minimal5 } from "./font/FontSaint11Minimal5";
export { type BpxGameInputEvent } from "./game_input/GameInput";
export { type BpxGamepadType } from "./game_input/GameInputGamepad";
export { BpxGamepadTypeDetector } from "./game_input/GamepadTypeDetector";
export { type BpxGameButtonName } from "./game_input/buttons/GameButtons";
export { BpxEasing, type BpxEasingFn } from "./misc/Easing";
export { BpxVector2d } from "./misc/Vector2d";
export {
  BpxAnimatedSprite,
  type BpxImageBoundAnimatedSpriteFactory,
} from "./sprite/AnimatedSprite";
export { BpxSprite, type BpxImageBoundSpriteFactory } from "./sprite/Sprite";
export { BpxTimer } from "./timer/Timer";

export { BeetPx, b_ } from "./BeetPx";
export { BpxUtils, u_ } from "./utils/Utils";

export * from "./shorthands";
