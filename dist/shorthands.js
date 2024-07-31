import { BpxPalettePico8 } from "./color/PalettePico8";
import { BpxRgbColor } from "./color/RgbColor";
import { BpxFont } from "./font/Font";
import { BpxFontConfigPico8 } from "./font/FontConfigPico8";
import { BpxFontConfigSaint11Minimal4 } from "./font/FontConfigSaint11Minimal4";
import { BpxFontConfigSaint11Minimal5 } from "./font/FontConfigSaint11Minimal5";
import { BpxVector2d } from "./misc/Vector2d";
import { BpxAnimatedSprite, } from "./sprite/AnimatedSprite";
import { BpxSprite } from "./sprite/Sprite";
import { BpxTimer } from "./timer/Timer";
import { BpxTimerSequence } from "./timer/TimerSequence";
import { identity } from "./utils/identity";

export function $aspr(imageUrl) {
    return (w, h, xys, opts) => {
        return BpxAnimatedSprite.from(imageUrl, w, h, xys, opts);
    };
}
export function $font(baseFontOrConfig, extendedConfig) {
    return baseFontOrConfig instanceof BpxFont ?
        BpxFont.basedOn(baseFontOrConfig, extendedConfig ?? identity)
        : BpxFont.of(baseFontOrConfig);
}
export const $font_pico8 = $font(new BpxFontConfigPico8());
export const $font_saint11Minimal4 = $font(new BpxFontConfigSaint11Minimal4());
export const $font_saint11Minimal5 = $font(new BpxFontConfigSaint11Minimal5());
export function $rgb(rOrCssHex, g, b) {
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

export function $spr(imageUrl) {
    return (w, h, x, y) => BpxSprite.from(imageUrl, w, h, x, y);
}

export function $timer(frames, opts) {
    return BpxTimer.for({
        frames,
        loop: opts?.loop ?? false,
        paused: opts?.paused ?? false,
        delayFrames: opts?.delayFrames ?? 0,
        onGamePause: opts?.onGamePause ?? "pause",
    });
}
export function $timerSeq(params, opts) {
    return BpxTimerSequence.of({
        intro: params.intro ?? [],
        loop: params.loop ?? [],
    }, {
        paused: opts?.paused ?? false,
        delayFrames: opts?.delayFrames ?? 0,
        onGamePause: opts?.onGamePause ?? "pause",
    });
}
export function $v(valueOrX, maybeY) {
    return BpxVector2d.of(valueOrX, maybeY ?? valueOrX);
}
export const $v_0_0 = $v(0, 0);
export const $v_1_1 = $v(1, 1);

