import { BpxImageUrl } from "./assets/Assets";
import { BpxPalettePico8 } from "./color/PalettePico8";
import { BpxRgbColor } from "./color/RgbColor";
import { BpxFont, BpxFontConfig } from "./font/Font";
import { BpxFontConfigPico8 } from "./font/FontConfigPico8";
import { BpxFontConfigSaint11Minimal4 } from "./font/FontConfigSaint11Minimal4";
import { BpxFontConfigSaint11Minimal5 } from "./font/FontConfigSaint11Minimal5";
import { BpxVector2d } from "./misc/Vector2d";
import {
  BpxAnimatedSprite,
  BpxImageBoundAnimatedSpriteFactory,
} from "./sprite/AnimatedSprite";
import { BpxImageBoundSpriteFactory, BpxSprite } from "./sprite/Sprite";
import { BpxTimer } from "./timer/Timer";
import { BpxTimerSequence } from "./timer/TimerSequence";
import { identity } from "./utils/identity";

/////////////////////////////////////////////////////////////////////////////

export function $aspr(
  imageUrl: BpxImageUrl,
): BpxImageBoundAnimatedSpriteFactory {
  return (
    w: number,
    h: number,
    xys: [x: number, y: number][],
    opts?: {
      frameDuration?: number;
      paused?: boolean;
      onGamePause?: "pause" | "ignore";
    },
  ) => {
    return BpxAnimatedSprite.from(imageUrl, w, h, xys, opts);
  };
}

/////////////////////////////////////////////////////////////////////////////

export function $font(config: Partial<BpxFontConfig>): BpxFont;
export function $font(
  baseFont: BpxFont,
  extendedConfig: (baseFontConfig: BpxFontConfig) => BpxFontConfig,
): BpxFont;
export function $font(
  baseFontOrConfig: BpxFont | Partial<BpxFontConfig>,
  extendedConfig?: (baseFontConfig: BpxFontConfig) => BpxFontConfig,
): BpxFont {
  return baseFontOrConfig instanceof BpxFont ?
      BpxFont.basedOn(baseFontOrConfig, extendedConfig ?? identity)
    : BpxFont.of(baseFontOrConfig);
}

export const $font_pico8 = $font(new BpxFontConfigPico8());
export const $font_saint11Minimal4 = $font(new BpxFontConfigSaint11Minimal4());
export const $font_saint11Minimal5 = $font(new BpxFontConfigSaint11Minimal5());

/////////////////////////////////////////////////////////////////////////////

export function $rgb(r: number, g: number, b: number): BpxRgbColor;
export function $rgb(cssHex: string): BpxRgbColor;
export function $rgb(
  rOrCssHex: string | number,
  g?: number,
  b?: number,
): BpxRgbColor {
  return typeof rOrCssHex === "string" ?
      BpxRgbColor.fromCssHex(rOrCssHex)
    : BpxRgbColor.of(rOrCssHex, g ?? 0, b ?? 0);
}

export const $rgb_black = $rgb("#000000");
export const $rgb_white = $rgb("#ffffff");
export const $rgb_red = $rgb("#ff0000");
export const $rgb_green = $rgb("#00ff00");
export const $rgb_blue = $rgb("#0000ff");
export const $rgb_cyan = $rgb("#00ffff");
export const $rgb_magenta = $rgb("#ff00ff");
export const $rgb_yellow = $rgb("#ffff00");

export const $rgb_p8 = BpxPalettePico8;

/////////////////////////////////////////////////////////////////////////////

export function $spr(imageUrl: BpxImageUrl): BpxImageBoundSpriteFactory {
  return (w: number, h: number, x: number, y: number) =>
    BpxSprite.from(imageUrl, w, h, x, y);
}

/////////////////////////////////////////////////////////////////////////////

export function $timer(
  frames: number,
  opts?: {
    loop?: boolean;
    paused?: boolean;
    delayFrames?: number;
    onGamePause?: "pause" | "ignore";
  },
): BpxTimer {
  return BpxTimer.for({
    frames,
    loop: opts?.loop ?? false,
    paused: opts?.paused ?? false,
    delayFrames: opts?.delayFrames ?? 0,
    onGamePause: opts?.onGamePause ?? "pause",
  });
}

export function $timerSeq<TPhaseName extends string>(
  params: {
    intro?: Array<[phase: TPhaseName, frames: number]>;
    loop?: Array<[phase: TPhaseName, frames: number]>;
  },
  opts?: {
    paused?: boolean;
    delayFrames?: number;
    onGamePause?: "pause" | "ignore";
  },
): BpxTimerSequence<TPhaseName> {
  return BpxTimerSequence.of<TPhaseName>(
    {
      intro: params.intro ?? [],
      loop: params.loop ?? [],
    },
    {
      paused: opts?.paused ?? false,
      delayFrames: opts?.delayFrames ?? 0,
      onGamePause: opts?.onGamePause ?? "pause",
    },
  );
}

/////////////////////////////////////////////////////////////////////////////

export function $v(value: number): BpxVector2d;
export function $v(x: number, y: number): BpxVector2d;
export function $v(valueOrX: number, maybeY?: number): BpxVector2d {
  return BpxVector2d.of(valueOrX, maybeY ?? valueOrX);
}

export const $v_0_0 = $v(0, 0);
export const $v_1_1 = $v(1, 1);

/////////////////////////////////////////////////////////////////////////////
