import { BpxFontPico8 } from "./font/FontPico8";
import { BpxFontSaint11Minimal4 } from "./font/FontSaint11Minimal4";
import { BpxFontSaint11Minimal5 } from "./font/FontSaint11Minimal5";
import { BpxVector2d } from "./misc/Vector2d";
import { BpxTimer } from "./timer/Timer";

export const font_pico8_ = new BpxFontPico8();
export const font_saint11Minimal4_ = new BpxFontSaint11Minimal4();
export const font_saint11Minimal5_ = new BpxFontSaint11Minimal5();

export function timer_(frames, opts) {
    return BpxTimer.for({
        frames,
        loop: opts?.loop ?? false,
        pause: opts?.pause ?? false,
        delayFrames: opts?.delayFrames ?? 0,
    });
}
export function v_(valueOrX, maybeY) {
    return BpxVector2d.of(valueOrX, maybeY ?? valueOrX);
}
export const v_0_0_ = v_(0, 0);
export const v_1_1_ = v_(1, 1);

