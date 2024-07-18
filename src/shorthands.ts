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

export function aspr_(
  imageUrl: BpxImageUrl,
): BpxImageBoundAnimatedSpriteFactory {
  return (
    w: number,
    h: number,
    xys: [x: number, y: number][],
    opts?: {
      onGamePause?: "pause" | "ignore";
    },
  ) => {
    return BpxAnimatedSprite.from(imageUrl, w, h, xys, opts);
  };
}

/////////////////////////////////////////////////////////////////////////////

export function font_(config: Partial<BpxFontConfig>): BpxFont;
export function font_(
  baseFont: BpxFont,
  extendedConfig: (baseFontConfig: BpxFontConfig) => BpxFontConfig,
): BpxFont;
export function font_(
  baseFontOrConfig: BpxFont | Partial<BpxFontConfig>,
  extendedConfig?: (baseFontConfig: BpxFontConfig) => BpxFontConfig,
): BpxFont {
  return baseFontOrConfig instanceof BpxFont ?
      BpxFont.basedOn(baseFontOrConfig, extendedConfig ?? identity)
    : BpxFont.of(baseFontOrConfig);
}

export const font_pico8_ = font_(new BpxFontConfigPico8());
export const font_saint11Minimal4_ = font_(new BpxFontConfigSaint11Minimal4());
export const font_saint11Minimal5_ = font_(new BpxFontConfigSaint11Minimal5());

/////////////////////////////////////////////////////////////////////////////

export function rgb_(r: number, g: number, b: number): BpxRgbColor;
export function rgb_(cssHex: string): BpxRgbColor;
export function rgb_(
  rOrCssHex: string | number,
  g?: number,
  b?: number,
): BpxRgbColor {
  return typeof rOrCssHex === "string" ?
      BpxRgbColor.fromCssHex(rOrCssHex)
    : BpxRgbColor.of(rOrCssHex, g ?? 0, b ?? 0);
}

export const rgb_black_ = rgb_("#000000");
export const rgb_white_ = rgb_("#ffffff");
export const rgb_red_ = rgb_("#ff0000");
export const rgb_green_ = rgb_("#00ff00");
export const rgb_blue_ = rgb_("#0000ff");
export const rgb_cyan_ = rgb_("#00ffff");
export const rgb_magenta_ = rgb_("#ff00ff");
export const rgb_yellow_ = rgb_("#ffff00");

export const rgb_p8_ = BpxPalettePico8;

/////////////////////////////////////////////////////////////////////////////

export function spr_(imageUrl: BpxImageUrl): BpxImageBoundSpriteFactory {
  return (w: number, h: number, x: number, y: number) =>
    BpxSprite.from(imageUrl, w, h, x, y);
}

/////////////////////////////////////////////////////////////////////////////

export function timer_(
  frames: number,
  opts?: {
    loop?: boolean;
    pause?: boolean;
    delayFrames?: number;
    onGamePause?: "pause" | "ignore";
  },
): BpxTimer {
  return BpxTimer.for({
    frames,
    loop: opts?.loop ?? false,
    pause: opts?.pause ?? false,
    delayFrames: opts?.delayFrames ?? 0,
    onGamePause: opts?.onGamePause ?? "pause",
  });
}

export function timerSeq_<TPhaseName extends string>(
  params: {
    intro?: Array<[phase: TPhaseName, frames: number]>;
    loop?: Array<[phase: TPhaseName, frames: number]>;
  },
  opts?: {
    pause?: boolean;
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
      pause: opts?.pause ?? false,
      delayFrames: opts?.delayFrames ?? 0,
      onGamePause: opts?.onGamePause ?? "pause",
    },
  );
}

/////////////////////////////////////////////////////////////////////////////

export function v_(value: number): BpxVector2d;
export function v_(x: number, y: number): BpxVector2d;
export function v_(valueOrX: number, maybeY?: number): BpxVector2d {
  return BpxVector2d.of(valueOrX, maybeY ?? valueOrX);
}

export const v_0_0_ = v_(0, 0);
export const v_1_1_ = v_(1, 1);

/////////////////////////////////////////////////////////////////////////////
