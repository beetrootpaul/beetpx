// `@notExported` is added to members here just to include this global in docs
//   generated by `typedoc` with help of `@zamiell/typedoc-plugin-not-exported`.
declare global {
  /**
   * Note: the generated documentation marks this variable as "Not Exported".
   *   This is *not* true.
   *
   * @notExported
   */
  const BEETPX__IS_PROD: boolean;

  /**
   * Note: the generated documentation marks this variable as "Not Exported".
   *   This is *not* true.
   *
   * @notExported
   */
  const BEETPX__VERSION: string;
}

// @ts-ignore
window.BEETPX__IS_PROD = __BEETPX__IS_PROD__;
// @ts-ignore
window.BEETPX__VERSION = __BEETPX__VERSION__;

export { BpxUtils } from "./Utils";
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
export { BpxPattern } from "./draw_api/Pattern";
export { BpxSprite } from "./draw_api/Sprite";
export { type BpxCharSprite, type BpxFont, type BpxFontId } from "./font/Font";
export { type BpxGameInputEvent } from "./game_input/GameInput";
export { type BpxGamepadType } from "./game_input/GameInputGamepad";
export { type BpxButtonName } from "./game_input/buttons/Buttons";
export {
  type BpxImageUrl,
  type BpxJsonUrl,
  type BpxSoundUrl,
} from "./misc/Assets";
export { BpxEasing, type BpxEasingFn } from "./misc/Easing";
export { BpxTimer } from "./misc/Timer";
export { BpxVector2d } from "./misc/Vector2d";

export { BeetPx } from "./BeetPx";

export { b_ } from "./BeetPx";
export { u_ } from "./Utils";
export { black_, blue_, green_, red_, white_ } from "./color/RgbColor";
export { spr_ } from "./draw_api/Sprite";
export { timer_ } from "./misc/Timer";
export { v_, v_0_0_, v_1_1_ } from "./misc/Vector2d";

// TODO: rework examples

// TODO: re-check what do we export here
