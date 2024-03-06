import { BpxFont } from "./font/Font";
import { BpxFontPico8 } from "./font/FontPico8";
import { BpxVector2d } from "./misc/Vector2d";
import { BpxTimer } from "./timer/Timer";

/////////////////////////////////////////////////////////////////////////////

export const font_pico8_: BpxFont = new BpxFontPico8();

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
