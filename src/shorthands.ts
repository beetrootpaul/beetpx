import { BpxImageUrl } from "./assets/Assets";
import { BpxPalettePico8 } from "./color/PalettePico8";
import { BpxRgbColor } from "./color/RgbColor";
import { BpxFont } from "./font/Font";
import { BpxFontPico8 } from "./font/FontPico8";
import { BpxFontSaint11Minimal4 } from "./font/FontSaint11Minimal4";
import { BpxFontSaint11Minimal5 } from "./font/FontSaint11Minimal5";
import { BpxVector2d } from "./misc/Vector2d";
import {
  BpxAnimatedSprite,
  BpxImageBoundAnimatedSpriteFactory,
} from "./sprite/AnimatedSprite";
import { BpxImageBoundSpriteFactory, BpxSprite } from "./sprite/Sprite";
import { BpxTimer } from "./timer/Timer";

/////////////////////////////////////////////////////////////////////////////

export function aspr_(
  imageUrl: BpxImageUrl,
): BpxImageBoundAnimatedSpriteFactory {
  return (w: number, h: number, xys: [x: number, y: number][]) => {
    return BpxAnimatedSprite.from(imageUrl, w, h, xys);
  };
}

/////////////////////////////////////////////////////////////////////////////

export const font_pico8_: BpxFont = new BpxFontPico8();
export const font_saint11Minimal4_: BpxFont = new BpxFontSaint11Minimal4();
export const font_saint11Minimal5_: BpxFont = new BpxFontSaint11Minimal5();

/////////////////////////////////////////////////////////////////////////////

export function rgb_(r: number, g: number, b: number): BpxRgbColor;
export function rgb_(cssHex: string): BpxRgbColor;
export function rgb_(
  rOrCssHex: string | number,
  g?: number,
  b?: number,
): BpxRgbColor {
  return typeof rOrCssHex === "string"
    ? BpxRgbColor.fromCssHex(rOrCssHex)
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
  opts?: { loop?: boolean; pause?: boolean; delayFrames?: number },
): BpxTimer {
  return BpxTimer.for({
    frames,
    loop: opts?.loop ?? false,
    pause: opts?.pause ?? false,
    delayFrames: opts?.delayFrames ?? 0,
  });
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
