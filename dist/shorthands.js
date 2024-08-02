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

/**
 * A shorthand for {@link BpxAnimatedSprite.from}. The difference is, in this
 * one the `imageUrl` is passed first and a new function is created out of it,
 * so you can use it to define animated sprites without passing that URL
 * over and over.
 *
 * @example
 * ```ts
 * const a = $aspr("spritesheet.png");
 * const animation1 = a(8, 8, [
 *   [0,0],
 *   [8,0],
 *   [16,0],
 * ]);
 * const animation2 = a(16, 8, [
 *   [0,8],
 *   [16,8],
 *   [90,90],
 * ], { frameDuration: 3 });
 * ```
 *
 * @category Drawing
 */
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
/**
 * A built-in font based on {@link BpxFontConfigPico8}
 *
 * @category Fonts
 */
export const $font_pico8 = $font(new BpxFontConfigPico8());
/**
 * A built-in font based on {@link BpxFontConfigSaint11Minimal4}
 *
 * @category Fonts
 */
export const $font_saint11Minimal4 = $font(new BpxFontConfigSaint11Minimal4());
/**
 * A built-in font based on {@link BpxFontConfigSaint11Minimal5}
 *
 * @category Fonts
 */
export const $font_saint11Minimal5 = $font(new BpxFontConfigSaint11Minimal5());
export function $rgb(rOrCssHex, g, b) {
    return typeof rOrCssHex === "string" ?
        BpxRgbColor.fromCssHex(rOrCssHex)
        : BpxRgbColor.of(rOrCssHex, g ?? 0, b ?? 0);
}
/**
 * A shorthand for `$rgb("#000000")`.
 *
 * @category Colors
 */
export const $rgb_black = $rgb("#000000");
/**
 * A shorthand for `$rgb("#ffffff")`.
 *
 * @category Colors
 */
export const $rgb_white = $rgb("#ffffff");
/**
 * A shorthand for `$rgb("#ff0000")`.
 *
 * @category Colors
 */
export const $rgb_red = $rgb("#ff0000");
/**
 * A shorthand for `$rgb("#00ff00")`.
 *
 * @category Colors
 */
export const $rgb_green = $rgb("#00ff00");
/**
 * A shorthand for `$rgb("#0000ff")`.
 *
 * @category Colors
 */
export const $rgb_blue = $rgb("#0000ff");
/**
 * A shorthand for `$rgb("#00ffff")`.
 *
 * @category Colors
 */
export const $rgb_cyan = $rgb("#00ffff");
/**
 * A shorthand for `$rgb("#ff00ff")`.
 *
 * @category Colors
 */
export const $rgb_magenta = $rgb("#ff00ff");
/**
 * A shorthand for `$rgb("#ffff00")`.
 *
 * @category Colors
 */
export const $rgb_yellow = $rgb("#ffff00");
/**
 * A shorthand for {@link BpxPalettePico8}
 *
 * @category Colors
 */
export const $rgb_p8 = BpxPalettePico8;

/**
 * A shorthand for {@link BpxSprite.from}. The difference is, in this
 * one the `imageUrl` is passed first and a new function is created out of it,
 * so you can use it to define sprites without passing that URL
 * over and over.
 *
 * @example
 * ```ts
 * const s = $spr("spritesheet.png");
 * const sprite1 = a(8, 8, 0, 0);
 * const sprite2 = a(16, 8, 90, 90);
 * ```
 *
 * @category Drawing
 */
export function $spr(imageUrl) {
    return (w, h, x, y) => BpxSprite.from(imageUrl, w, h, x, y);
}

/**
 * A shorthand for {@link BpxTimer.of}.
 *
 * @example
 * ```ts
 * $timer(60, { loop: true });
 * ```
 *
 * @category Core
 */
export function $timer(frames, opts) {
    return BpxTimer.of({
        frames,
        loop: opts?.loop ?? false,
        paused: opts?.paused ?? false,
        delayFrames: opts?.delayFrames ?? 0,
        onGamePause: opts?.onGamePause ?? "pause",
    });
}
/**
 * A shorthand for {@link BpxTimerSequence.of}.
 *
 * @example
 * ```ts
 * $timerSeq({
 *   intro: [
 *     ["entrance", 8],
 *   ],
 *   loop: [
 *     ["attack1", 60],
 *     ["pause1", 60],
 *     ["attack2", 120],
 *     ["pause2", 90],
 *   ],
 * }, {
 *   paused: true,
 * });
 * ```
 *
 * @template {string} TPhaseName Names of the phases used as keys in `intro` and `loop`.
 *                               It allows for a phase name type-checking in the places
 *                               where the timer sequence is used.
 *                               Usually you doesn't have to specify those phase names
 *                               in the template definition, since they are inferred
 *                               by TypeScript from the `intro` and `loop`.
 *
 * @category Core
 */
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
/**
 * A shorthand for `$v(0, 0)`.
 *
 * @category Core
 */
export const $v_0_0 = $v(0, 0);
/**
 * A shorthand for `$v(0, 0)`.
 *
 * @category Core
 */
export const $v_1_1 = $v(1, 1);

