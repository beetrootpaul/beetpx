import { BpxPalettePico8 } from "./color/PalettePico8";
import { BpxRgbColor } from "./color/RgbColor";
import { BpxFontPico8 } from "./font/FontPico8";
import { BpxFontSaint11Minimal4 } from "./font/FontSaint11Minimal4";
import { BpxFontSaint11Minimal5 } from "./font/FontSaint11Minimal5";
import { BpxVector2d } from "./misc/Vector2d";
import { BpxAnimatedSprite, } from "./sprite/AnimatedSprite";
import { BpxSprite } from "./sprite/Sprite";
import { BpxTimer } from "./timer/Timer";
import { BpxTimerSequence } from "./timer/TimerSequence";

export function aspr_(imageUrl) {
    return (w, h, xys) => {
        return BpxAnimatedSprite.from(imageUrl, w, h, xys);
    };
}

export const font_pico8_ = new BpxFontPico8();
export const font_saint11Minimal4_ = new BpxFontSaint11Minimal4();
export const font_saint11Minimal5_ = new BpxFontSaint11Minimal5();
export function rgb_(rOrCssHex, g, b) {
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

export function spr_(imageUrl) {
    return (w, h, x, y) => BpxSprite.from(imageUrl, w, h, x, y);
}

export function timer_(frames, opts) {
    return BpxTimer.for({
        frames,
        loop: opts?.loop ?? false,
        pause: opts?.pause ?? false,
        delayFrames: opts?.delayFrames ?? 0,
    });
}
export function timerSeq_(params, opts) {
    return BpxTimerSequence.of({
        intro: params.intro ?? [],
        loop: params.loop ?? [],
    }, {
        pause: opts?.pause ?? false,
        delayFrames: opts?.delayFrames ?? 0,
    });
}
export function v_(valueOrX, maybeY) {
    return BpxVector2d.of(valueOrX, maybeY ?? valueOrX);
}
export const v_0_0_ = v_(0, 0);
export const v_1_1_ = v_(1, 1);

