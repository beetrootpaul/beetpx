import { PngDataArray } from 'fast-png';

/**
 * @see {@link BpxImageAsset}
 *
 * @category Assets
 */
type BpxImageUrl = string;
/**
 * @see {@link BpxSoundAsset}
 *
 * @category Assets
 */
type BpxSoundUrl = string;
/**
 * @see {@link BpxJsonAsset}
 *
 * @category Assets
 */
type BpxJsonUrl = string;
/**
 * @example
 * ```ts
 * const sprite1Url: BpxImageUrl = "spritesheet.png"; // refers to `./public/spritesheet.png`
 * const sprite2Url: BpxImageUrl = "https://the.url/of/another-spritesheet.png";
 *
 * let sprite1: BpxSprite;
 * let sprite2: BpxSprite;
 *
 * $x.setOnStarted(() => {
 *   sprite1 = $spr(sprite1Url)(8,8,0,0);
 *   sprite2 = $spr(sprite2Url)(8,8,0,0);
 * });
 *
 * $x.start({
 *   // ...,
 *  assets: [
 *    sprite1Url,
 *    sprite2Url,
 *  ],
 * });
 * ```
 *
 * @category Assets
 */
type BpxImageAsset = {
    /**
     * Image's width in pixels.
     */
    width: number;
    /**
     * Image's height in pixels.
     */
    height: number;
    /**
     * Number of image channels.
     */
    channels: 3 | 4;
    /**
     * The actual image data.
     */
    rgba8bitData: PngDataArray;
};
/**
 * @example
 * ```ts
 * const musicUrl: BpxSoundUrl = "music.flac"; // refers to `./public/music.flac`
 * const sfxUrl: BpxSoundUrl = "https://the.url/of/sfx.wav";
 *
 * let playback1: BpxAudioPlaybackId;
 * let playback2: BpxAudioPlaybackId;
 *
 * $x.setOnStarted(() => {
 *   playback1 = $x.startPlayback(musicUrl);
 *   playback2 = $x.startPlayback(sfxUrl);
 * });
 *
 * $x.start({
 *   // ...,
 *  assets: [
 *    musicUrl,
 *    sfxUrl,
 *  ],
 * });
 * ```
 *
 * @category Assets
 */
type BpxSoundAsset = {
    /**
     * The actual sound data.
     */
    audioBuffer: AudioBuffer;
};
/**
 * @example
 * ```ts
 * const statsUrl: BpxJsonUrl = "level.ldtk"; // refers to `./public/stats.json`
 * const levelUrl: BpxJsonUrl = "https://the.url/of/level.ldtk";
 *
 * let stats: BpxJsonAsset;
 * let level: BpxJsonAsset;
 *
 * $x.setOnStarted(() => {
 *   const stats: BpxJsonAsset = $x.getJsonAsset(statsUrl);
 *   const level: BpxJsonAsset = $x.getJsonAsset(levelUrl);
 * });
 *
 * $x.start({
 *   // ...,
 *  assets: [
 *    statsUrl,
 *    levelUrl,
 *  ],
 * });
 * ```
 *
 * @category Assets
 */
type BpxJsonAsset = {
    /**
     * A content of the fetched JSON file.
     */
    json: any;
};

/**
 * @see {@link BpxEngineConfig}'s `assets`
 *
 * @category Assets
 */
type BpxAssetsToLoad = Array<BpxImageUrl | BpxSoundUrl | BpxJsonUrl>;

/**
 * An identifier of a played audio. Can be used to e.g. mute a specific sound.
 *
 * @see {@link BeetPx.startPlayback}
 * @see {@link BeetPx.startPlaybackLooped}
 * @see {@link BeetPx.startPlaybackSequence}
 *
 * @category Audio
 */
type BpxAudioPlaybackId = number;

/**
 * A definition of a sequence of sounds to be played. A typical use case would be
 * to define a music which consist of an intro phase, then loops indefinitely. Another
 * use case is to recreate the music composed in PICO-8 – it usually is built from
 * many short samples, tied together. Moreover, the `BpxSoundSequence` allows to
 * crop the sample, which might be useful for a PICO-8 music composed of samples
 * shorter than default 32 bits, but exported as 33-bits long.
 *
 * @example
 * ```ts
 *  const halfDuration = (fullSoundDurationMs: number) => fullSoundDurationMs * 16 / 32;
 *  $x.startPlaybackSequence({
 *    intro: [
 *      [{ url: "intro1Melody.flac", durationMs: halfDuration }],
 *      [{ url: "intro2Melody.flac", durationMs: halfDuration }, { url: "intro2Bass.flac" }],
 *    ],
 *    loop: [
 *      ["loop1Melody.flac", "loop1Bass.flac"],
 *      ["loop2Melody.flac", "loop2Bass.flac"],
 *      ["loop3Melody.flac", "loop3Bass.flac"],
 *    ],
 *  });
 * ```
 *
 * @category Audio
 */
type BpxSoundSequence = {
    intro?: BpxSoundSequenceEntry[];
    loop?: BpxSoundSequenceEntry[];
};
/**
 * @see {@link BpxSoundSequence}
 *
 * @category Audio
 */
type BpxSoundSequenceEntry = [
    BpxSoundSequenceEntrySoundMain,
    ...BpxSoundSequenceEntrySoundAdditional[]
];
/**
 * @see {@link BpxSoundSequence}
 *
 * @category Audio
 */
type BpxSoundSequenceEntrySoundMain = BpxSoundUrl | {
    url: BpxSoundUrl;
    durationMs?: (fullSoundDurationMs: number) => number;
};
/**
 * @see {@link BpxSoundSequence}
 *
 * @category Audio
 */
type BpxSoundSequenceEntrySoundAdditional = BpxSoundUrl | {
    url: BpxSoundUrl;
};

/**
 * The list of browser types the engine detects.
 * It is tightly related to the gamepad mapping detection.
 *
 * @see {@link BeetPx.detectedBrowserType}
 *
 * @category Game input
 */
type BpxBrowserType = "chromium" | "firefox_windows" | "firefox_other" | "safari" | "other";

/**
 * @see {@link BpxRgbColor}
 *
 * @category Colors
 */
type BpxRgbCssHex = string;
/**
 * A representation of a RGB, fully opaque color
 *
 * @category Colors
 */
declare class BpxRgbColor {
    /**
     * @example
     * ```ts
     * BpxRgbColor.of(255, 0, 77);
     * ```
     *
     * @group Static factories
     */
    static of(r: number, g: number, b: number): BpxRgbColor;
    /**
     * @example
     * ```ts
     * BpxRgbColor.fromCssHex("#FF004D");
     * ```
     *
     * @group Static factories
     */
    static fromCssHex(cssHex: BpxRgbCssHex): BpxRgbColor;
    /**
     * A property helpful for TypeScript type inference, when distinguishing from
     * other types of colors.
     *
     * @example
     * ```ts
     * const c:
     *   | null
     *   | BpxRgbColor
     *   | BpxPatternColors
     *   | BpxSpriteColorMapping
     *   | BpxCanvasSnapshotColorMapping
     *   = getColor();
     * if (c == null) {
     *   // c is transparent here
     * } else if (c.type === "rgb") {
     *   // c is BpxRgbColor here
     * } else if (c.type === "pattern") {
     *   // c is BpxPatternColors here
     * } else if (c.type === "sprite_mapping") {
     *   // c is BpxSpriteColorMapping here
     * } else if (c.type === "canvas_snapshot_mapping") {
     *   // c is BpxCanvasSnapshotColorMapping here
     * } else {
     *   $u.assertUnreachable(c);
     * }
     * ```
     */
    readonly type = "rgb";
    /**
     * A red component, an integer between 0 and 255.
     */
    readonly r: number;
    /**
     A green component, an integer between 0 and 255.
     */
    readonly g: number;
    /**
     A blue component, an integer between 0 and 255.
     */
    readonly b: number;
    /**
     * A hex representation of this color. Can be used e.g. for CSS.
     * Or just for simple way to store a color as a single value.
     */
    readonly cssHex: BpxRgbCssHex;
    private constructor();
    /**
     * Checks if this color has same red, green, and blue components as the other one.
     */
    isSameAs(another: BpxRgbColor): boolean;
    /**
     * Returns an array containing red, green, and blue components of this color.
     */
    asArray(): [r: number, g: number, b: number];
}

/**
 * @see {@link BpxCanvasSnapshotColorMapping.getMappedColor}
 *
 * @category Drawing
 */
interface BpxCanvasSnapshot {
    getColorAt(x: number, y: number): BpxRgbColor;
}

/**
 * @see {@link BpxSpriteColorMapping}
 * @see {@link BpxCanvasSnapshotColorMapping}
 *
 * @category Drawing
 */
type BpxColorMapper = (sourceColor: BpxRgbColor | null, x?: number, y?: number) => BpxRgbColor | null;

/**
 * An interface to extend if you want to define `__printDebug()` – a convenience method used by
 * the internal logger to print objects in a custom way. An example is built-in
 * {@link BpxVector2d} type which defined `__printDebug()` in order to be printed
 * by the logger in a `(x,y)` format.
 *
 * @see {@link BeetPx.logDebug}
 * @see {@link BeetPx.logInfo}
 * @see {@link BeetPx.logWarn}
 * @see {@link BeetPx.logError}
 *
 * @category Debug
 */
interface BpxPrintDebug {
    __printDebug(): string;
}

/**
 * A core building block for many pieces of the BeetPx API – a vector, which is 2D point representation of (X,Y).
 *
 * @category Core
 */
declare class BpxVector2d implements BpxPrintDebug {
    /**
     * The X component of the vector.
     */
    readonly x: number;
    /**
     * The X component of the vector.
     */
    readonly y: number;
    /**
     * @param turnAngle A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     *
     * @returns A vector of a length 1, angled according to a given `turnAngle`. E.g. `(0, -1)` for an angle of `-0.25`.
     *
     * @group Static factories
     */
    static unitFromAngle(turnAngle: number): BpxVector2d;
    /**
     * An equivalent of `BpxVector2d.of(value, value)`.
     *
     * @group Static factories
     */
    static of(value: number): BpxVector2d;
    /**
     * @group Static factories
     */
    static of(x: number, y: number): BpxVector2d;
    private constructor();
    /**
     * Creates a vector which has the lowest X and Y from two other given vectors.
     *
     * @group Static factories
     */
    static minOf(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d;
    /**
     * Creates a vector which has the highest X and Y from two other given vectors.
     *
     * @group Static factories
     */
    static maxOf(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d;
    /**
     * An equivalent of `[BpxVector2d.minOf(xy1, xy2), BpxVector2d.maxOf(xy1, xy2)]`.
     *
     * @example
     * ```ts
     * const [minV, maxV] = BpxVector2d.minMaxOf(v1, v2);
     * ```
     *
     * @group Static factories
     */
    static minMaxOf(xy1: BpxVector2d, xy2: BpxVector2d): [BpxVector2d, BpxVector2d];
    /**
     * Creates a vector with X and Y passed through the {@link BeetPxUtils.lerp} individually.
     *
     * @group Static factories
     */
    static lerp(xy1: BpxVector2d, xy2: BpxVector2d, t: number, opts?: {
        clamp?: boolean;
    }): BpxVector2d;
    /**
     * @returns An array of `[x, y]`.
     */
    asArray(): [number, number];
    /**
     * @returns A magnitude (length) of the vector, which is `sqrt(x^2 + y^2)`.
     */
    magnitude(): number;
    /**
     * @returns A vector of same angle, but of length 1. Or 0, if the original vector was 0.
     */
    normalize(): BpxVector2d;
    /**
     * @returns A vector in which each component is either `-1`, `0`, or `1` to indicate the sign of the original value.
     */
    sign(): BpxVector2d;
    /**
     * @returns A vector in which each component is an absolute value of the original value.
     */
    abs(): BpxVector2d;
    /**
     * @returns A vector in which each component is a negative of the original value.
     */
    neg(): BpxVector2d;
    /**
     * @returns A vector in which each component is a floor rounding of the original value.
     */
    floor(): BpxVector2d;
    /**
     * @returns A vector in which each component is a ceil rounding of the original value.
     */
    ceil(): BpxVector2d;
    /**
     * @returns A vector in which each component is a rounding of the original value.
     */
    round(): BpxVector2d;
    /**
     * This method is an equivalent of calling {@link BeetPxUtils.trigAtan2} with both `x` and `y` of this vector as the params.
     *
     * @returns The "turn" of the vector. A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    toAngle(): number;
    /**
     * @returns If the vector has both of its components equal to the same components of a given vector.
     */
    eq(other: BpxVector2d): boolean;
    /**
     * @returns If the vector has both of its components equal to a given value.
     */
    eq(value: number): boolean;
    /**
     * @returns If the vector has both of its components equal to a given x and y.
     */
    eq(x: number, y: number): boolean;
    /**
     * @returns If the vector has both of its components greater than the same components of a given vector.
     */
    gt(other: BpxVector2d): boolean;
    /**
     * @returns If the vector has both of its components greater than a given value.
     */
    gt(value: number): boolean;
    /**
     * @returns If the vector has both of its components greater than a given x and y.
     */
    gt(x: number, y: number): boolean;
    /**
     * @returns If the vector has both of its components greater or equal to the same components of a given vector.
     */
    gte(other: BpxVector2d): boolean;
    /**
     * @returns If the vector has both of its components greater or equal to a given value.
     */
    gte(value: number): boolean;
    /**
     * @returns If the vector has both of its components greater or equal to a given x and y.
     */
    gte(x: number, y: number): boolean;
    /**
     * @returns If the vector has both of its components lower than the same components of a given vector.
     */
    lt(other: BpxVector2d): boolean;
    /**
     * @returns If the vector has both of its components lower than a given value.
     */
    lt(value: number): boolean;
    /**
     * @returns If the vector has both of its components lower than a given x and y.
     */
    lt(x: number, y: number): boolean;
    /**
     * @returns If the vector has both of its components lower or equal to the same components of a given vector.
     */
    lte(other: BpxVector2d): boolean;
    /**
     * @returns If the vector has both of its components lower or equal to a given value.
     */
    lte(value: number): boolean;
    /**
     * @returns If the vector has both of its components lower or equal to a given x and y.
     */
    lte(x: number, y: number): boolean;
    /**
     * @returns Creates a vector with X and Y passed through the {@link BeetPxUtils.clamp} individually.
     */
    clamp(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d;
    /**
     * @returns Creates a vector with X and Y passed through the {@link BeetPxUtils.mod} individually.
     *          This variant of the method uses X and Y of another vector to run `mod` on both X and Y
     *          respectively.
     */
    mod(other: BpxVector2d): BpxVector2d;
    /**
     * @returns Creates a vector with X and Y passed through the {@link BeetPxUtils.mod} individually.
     *          This variant of the method uses a single value to run `mod` on both X and Y
     *          with it.
     */
    mod(value: number): BpxVector2d;
    /**
     * @returns Creates a vector with X and Y passed through the {@link BeetPxUtils.mod} individually.
     *          This variant of the method uses X and Y to run `mod` on both X and Y
     *          respectively.
     */
    mod(x: number, y: number): BpxVector2d;
    /**
     * Addition.
     */
    add(other: BpxVector2d): BpxVector2d;
    /**
     * Addition.
     */
    add(value: number): BpxVector2d;
    /**
     * Addition.
     */
    add(x: number, y: number): BpxVector2d;
    /**
     * Subtraction.
     */
    sub(other: BpxVector2d): BpxVector2d;
    /**
     * Subtraction.
     */
    sub(value: number): BpxVector2d;
    /**
     * Subtraction.
     */
    sub(x: number, y: number): BpxVector2d;
    /**
     * Multiplication.
     */
    mul(other: BpxVector2d): BpxVector2d;
    /**
     * Multiplication.
     */
    mul(value: number): BpxVector2d;
    /**
     * Multiplication.
     */
    mul(x: number, y: number): BpxVector2d;
    /**
     * Division.
     */
    div(other: BpxVector2d): BpxVector2d;
    /**
     * Division.
     */
    div(value: number): BpxVector2d;
    /**
     * Division.
     */
    div(x: number, y: number): BpxVector2d;
    /**
     * This definition allows to "spread" the vector, e.g.: `[...myVector]`.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator
     */
    [Symbol.iterator](): Generator<number>;
    /**
     * This definition serializes the vector to a string `(x,y)` when coercion happens, e.g.: `+myVector`.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive
     */
    [Symbol.toPrimitive](hint: "default" | "string" | "number"): string | number;
    /**
     * This definition makes the vector represented with its class names in those scenario where normally
     * you would see `[object Object]` in logs.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag
     */
    get [Symbol.toStringTag](): string;
    /**
     * A convenience method used by the internal logger to print vectors no as JS object,
     * but as `(x, y)` strings.
     *
     * Usually you wouldn't have to call this method directly in your game code.
     *
     * @see {@link BpxPrintDebug}
     * @see {@link BeetPx.logDebug}
     * @see {@link BeetPx.logInfo}
     * @see {@link BeetPx.logWarn}
     * @see {@link BeetPx.logError}
     */
    __printDebug(): string;
}

/**
 * @see {@link BeetPxDraw.takeCanvasSnapshot}
 *
 * @see https://github.com/beetrootpaul/beetpx-examples/tree/main/canvas-snapshot
 *
 * @category Drawing
 */
declare class BpxCanvasSnapshotColorMapping {
    #private;
    /**
     * @group Static factories
     */
    static of(mapper: BpxColorMapper): BpxCanvasSnapshotColorMapping;
    /**
     * A property helpful for TypeScript type inference, when distinguishing from
     * other types of colors.
     *
     * @example
     * ```ts
     * const c:
     *   | null
     *   | BpxRgbColor
     *   | BpxPatternColors
     *   | BpxSpriteColorMapping
     *   | BpxCanvasSnapshotColorMapping
     *   = getColor();
     * if (c == null) {
     *   // c is transparent here
     * } else if (c.type === "rgb") {
     *   // c is BpxRgbColor here
     * } else if (c.type === "pattern") {
     *   // c is BpxPatternColors here
     * } else if (c.type === "sprite_mapping") {
     *   // c is BpxSpriteColorMapping here
     * } else if (c.type === "canvas_snapshot_mapping") {
     *   // c is BpxCanvasSnapshotColorMapping here
     * } else {
     *   $u.assertUnreachable(c);
     * }
     * ```
     */
    readonly type = "canvas_snapshot_mapping";
    private constructor();
    /**
     * The main method of this class, used to get a mapped color for a given color on the canvas snapshot.
     */
    getMappedColor(snapshot: BpxCanvasSnapshot | null, canvasX: number, canvasY: number): BpxRgbColor | null;
}

/**
 * A set of two colors, used in combination with {@link BpxDrawingPattern},
 * where given pixels are colored with either the `primary` or the `secondary`.
 *
 * @category Colors
 */
declare class BpxPatternColors {
    /**
     * The primary color or a transparency (denoted by `null`).
     */
    readonly primary: BpxRgbColor | null;
    /**
     * The secondary color or a transparency (denoted by `null`).
     */
    readonly secondary: BpxRgbColor | null;
    /**
     * @example
     * ```ts
     * BpxPatternColors.of($rgb_red, $rgb_blue);
     * ```
     *
     * @group Static factories
     */
    static of(primary: BpxRgbColor | null, secondary: BpxRgbColor | null): BpxPatternColors;
    /**
     * A property helpful for TypeScript type inference, when distinguishing from
     * other types of colors.
     *
     * @example
     * ```ts
     * const c:
     *   | null
     *   | BpxRgbColor
     *   | BpxPatternColors
     *   | BpxSpriteColorMapping
     *   | BpxCanvasSnapshotColorMapping
     *   = getColor();
     * if (c == null) {
     *   // c is transparent here
     * } else if (c.type === "rgb") {
     *   // c is BpxRgbColor here
     * } else if (c.type === "pattern") {
     *   // c is BpxPatternColors here
     * } else if (c.type === "sprite_mapping") {
     *   // c is BpxSpriteColorMapping here
     * } else if (c.type === "canvas_snapshot_mapping") {
     *   // c is BpxCanvasSnapshotColorMapping here
     * } else {
     *   $u.assertUnreachable(c);
     * }
     * ```
     */
    readonly type = "pattern";
    private constructor();
}

/**
 * @see {@link BeetPxDraw.setSpriteColorMapping}
 *
 * @category Drawing
 */
declare class BpxSpriteColorMapping {
    #private;
    /**
     * A mapping used by default, which takes sprite colors as they are,
     * without any changes. An equivalent of `BpxSpriteColorMapping.of((c, _x, _y) => c)`.
     *
     * @group Static values
     */
    static noMapping: BpxSpriteColorMapping;
    /**
     * Creates a simplified color mapping, based on a map of sprite colors to the new ones.
     *
     * `null` can be used to map a given sprite color into a transparency. It is useful e.g. when
     * we have a sprite with a black used as a background, so we can treat all black pixels as
     * transparent when drawing.
     *
     * @example
     * ```ts
     * BpxSpriteColorMapping.from([
     *   [$rgb_red, $rgb_green],
     *   [$rgb_blue, $rgb_green],
     *   [$rgb_yellow, null],
     * ]);
     * ```
     *
     * @group Static factories
     */
    static from(colorMappingEntries: Array<[BpxRgbColor, BpxRgbColor | null]>): BpxSpriteColorMapping;
    /**
     * Creates a color mapping which uses a function to map a sprite color
     * into a new one.
     *
     * @example
     * ```ts
     * BpxSpriteColorMapping.of((color: BpxRgbColor | null, spriteX: number, spriteY: number) =>
     *   color
     *     ? $rgb(255 - color.r, 255 - color.g, 255 - color.b)
     *     : null
     * );
     * ```
     *
     * @group Static factories
     */
    static of(mapper: BpxColorMapper): BpxSpriteColorMapping;
    /**
     * A property helpful for TypeScript type inference, when distinguishing from
     * other types of colors.
     *
     * @example
     * ```ts
     * const c:
     *   | null
     *   | BpxRgbColor
     *   | BpxPatternColors
     *   | BpxSpriteColorMapping
     *   | BpxCanvasSnapshotColorMapping
     *   = getColor();
     * if (c == null) {
     *   // c is transparent here
     * } else if (c.type === "rgb") {
     *   // c is BpxRgbColor here
     * } else if (c.type === "pattern") {
     *   // c is BpxPatternColors here
     * } else if (c.type === "sprite_mapping") {
     *   // c is BpxSpriteColorMapping here
     * } else if (c.type === "canvas_snapshot_mapping") {
     *   // c is BpxCanvasSnapshotColorMapping here
     * } else {
     *   $u.assertUnreachable(c);
     * }
     * ```
     */
    readonly type = "sprite_mapping";
    private constructor();
    /**
     * The main method of this class, used to get a mapped color for a given color on the sprite.
     */
    getMappedColor(spriteColor: BpxRgbColor | null, spriteX: number, spriteY: number): BpxRgbColor | null;
}

/**
 * A 1-bit image rectangular image defined in-code.
 *
 * @category Drawing
 */
declare class BpxPixels {
    /**
     * @example
     * ```ts
     * BpxPixels.from(`
     *   #####
     *   #-#-#
     *   #-#-#
     *   #####
     * `);
     * ```
     *
     * @group Static factories
     */
    static from(ascii: string): BpxPixels;
    /**
     * The `#`/`-` representation of the image, split into rows.
     */
    readonly asciiRows: string[];
    /**
     * The size of the image.
     */
    readonly size: BpxVector2d;
    private constructor();
}

/**
 * @see {@link $spr}
 *
 * @category Drawing
 */
type BpxImageBoundSpriteFactory = (w: number, h: number, x: number, y: number) => BpxSprite;
/**
 * A definition of a sprite,
 * which can later be used for drawing by {@link BeetPxDraw.sprite}.
 *
 * @see {@link $spr}
 *
 * @category Drawing
 */
declare class BpxSprite {
    /**
     * @see {@link $spr}
     *
     * @group Static factories
     */
    static from(imageUrl: BpxImageUrl, w: number, h: number, x: number, y: number): BpxSprite;
    /**
     * A property helpful for TypeScript type inference, when distinguishing from
     * other types of sprites.
     *
     * @example
     * ```ts
     * const s: BpxSprite | BpxAnimatedSprite = getSprite();
     * if (s.type === "static") {
     *   // s is BpxSprite here
     * } else if (s.type === "animated") {
     *   // s is BpxAnimatedSprite here
     * } else {
     *   $u.assertUnreachable(s);
     * }
     * ```
     */
    readonly type = "static";
    readonly imageUrl: BpxImageUrl;
    readonly size: BpxVector2d;
    readonly xy: BpxVector2d;
    private constructor();
    /**
     * Creates a new sprite definition, clipped by given sprite coordinates.
     */
    clipBy(xy1: BpxVector2d, xy2: BpxVector2d): BpxSprite;
}

/**
 * The map of how much to adjust the vertical placement of this glyph if the
 * previous text segment (char) was one of the keys in this map.
 *
 * @example
 * ```ts
 * $d.setFont(
 *   $font({
 *     glyphs: new Map<string, BpxGlyph>([
 *       [
 *         "T",
 *         {
 *           // ...
 *         },
 *       ],
 *       [
 *         "i",
 *         {
 *           // ...
 *           kerning: {
 *             // put "i" a 1 px closer to "T", so they do not look so distant visually
 *             T: -1,
 *           },
 *         },
 *       ],
 *     ]),
 *   }),
 * );
 * ```
 *
 * @category Fonts
 */
type BpxKerningPrevSegmentMap = {
    [prevSegment: string]: number;
};
/**
 * A map of special text sequences to be treated as instructions to change the color of the
 * printed text from a given char position.
 *
 * @example
 * ```ts
 * const prevMarkers = $d.setTextColorMarkers({
 *   red_theBest: $rgb_red,
 *   b: $rgb_blue,
 * });
 * $d.text("colors are: green, [b]blue, [red_theBest]red", $v(10), $rgb_green);
 * $d.setTextColorMarkers(prevMarkers);
 * ```
 *
 * @see {@link BeetPxDraw.setTextColorMarkers}
 *
 * @category Drawing
 */
type BpxTextColorMarkers = {
    [marker: string]: BpxRgbColor;
};
/**
 * A definition of a glyph used by a font. Used as values in {@link BpxFontConfig.glyphs}.
 *
 * @category Fonts
 */
type BpxGlyph = {
    /** A property used in checking which type of a glyph it is, so TypeScript can infer its properties correctly. */
    type: "sprite";
    /** A sprite to be drawn for this glyph. */
    sprite: BpxSprite;
    /** A function used to distinguish text from its background on a sprite sheet. */
    isTextColor: (color: BpxRgbColor | null) => boolean;
    /** How much to move the text drawing cursor to the right after drawing this glyph. Measured from the left edge of the glyph. */
    advance: number;
    /** The relative position of the glyph to be drawn in relation to the current cursor position. */
    offset?: BpxVector2d;
    /** The map of how much to adjust the vertical placement of this glyph if the previous text segment (char) was one of the keys in this map. */
    kerning?: BpxKerningPrevSegmentMap;
} | {
    /** A property used in checking which type of a glyph it is, so TypeScript can infer its properties correctly. */
    type: "pixels";
    /** A sprite to be drawn for this glyph, represented by 1-bit representation in the game code. */
    pixels: BpxPixels;
    /** How much to move the text drawing cursor to the right after drawing this glyph. Measured from the left edge of the glyph. */
    advance: number;
    /** The relative position of the glyph to be drawn in relation to the current cursor position. */
    offset?: BpxVector2d;
    /** The map of how much to adjust the vertical placement of this glyph if the previous text segment (char) was one of the keys in this map. */
    kerning?: BpxKerningPrevSegmentMap;
} | {
    /** A property used in checking which type of a glyph it is, so TypeScript can infer its properties correctly. */
    type: "whitespace";
    /** How much to move the text drawing cursor to the right after processing this glyph. Measured from the left edge of the glyph. */
    advance: number;
    /** The map of how much to adjust the vertical placement of this glyph if the previous text segment (char) was one of the keys in this map. */
    kerning?: BpxKerningPrevSegmentMap;
};
/**
 * Similar to {@link BpxGlyph}, but after being arranged by {@link BpxFont.arrangeGlyphsFor}
 * in context of given glyphs' placement, text color, and color markers.
 *
 * Used by {@link BeetPxDraw.measureText} for a headless text rendering. Also, used
 * by {@link BeetPxDraw.text} for an actual text rendering.
 *
 * @category Fonts
 */
type BpxArrangedGlyph = {
    type: "sprite";
    char: string;
    /** Left-top position of a glyph in relation to the left-top of the entire text. */
    leftTop: BpxVector2d;
    /** Line number within the entire text (multiple lines can be achieved by including `\n` within the text). */
    lineNumber: number;
    sprite: BpxSprite;
    /** The color mapping used to draw a glyph's sprite in a desired text color. */
    spriteColorMapping: BpxSpriteColorMapping;
} | {
    type: "pixels";
    char: string;
    /** Left-top position of a glyph in relation to the left-top of the entire text. */
    leftTop: BpxVector2d;
    /** Line number within the entire text (multiple lines can be achieved by including `\n` within the text). */
    lineNumber: number;
    pixels: BpxPixels;
    color: BpxRgbColor;
} | {
    type: "line_break";
    /** Line number within the entire text (multiple lines can be achieved by including `\n` within the text). */
    lineNumber: number;
};
/**
 * A font definition.
 *
 * @example
 * ```ts
 * $d.setFont($font({
 *   ascent: 5,
 *   descent: 0,
 *   lineGap: 1,
 *
 *   mapGrapheme(grapheme: string): string {
 *     return grapheme.toLowerCase();
 *   },
 *
 *   glyphs: new Map<string, BpxGlyph>([
 *     [" ", { type: "whitespace", advance: 4 }],
 *     ["0", { type: "sprite", ... }],
 *     // a lot more glyphs defined here
 *   ]),
 * });
 * ```
 *
 * @see https://github.com/beetrootpaul/beetpx-examples/tree/main/fonts
 *
 * @category Fonts
 */
type BpxFontConfig = {
    /**
     * An amount of pixels from the baseline (included) to the top-most pixel of font's glyphs.
     */
    ascent: number;
    /**
     * An amount of pixels from the baseline (excluded) to the bottom-most pixel of font's glyphs.
     */
    descent: number;
    /**
     * An amount of pixels between the bottom-most pixel of the previous line (excluded) and
     * the top-most pixel of the next line (excluded).
     */
    lineGap: number;
    /**
     * This functions maps the text grapheme (a user-perceived character like `a` or a
     * multi-character emoji like `❤️`) before trying to find its corresponding glyph
     * in a `glyphs` map. It would be typically used to call `grapheme.toLowerCase()`
     * in fonts which have glyphs defined for lower-case characters only.
     */
    mapGrapheme: (grapheme: string) => string;
    /**
     * A map which contains the glyphs for specified graphemes (keys of the map).
     * Grapheme is a user-perceived character like `a` or a multi-character emoji
     * like `❤️`. Before retrieving a glyph from this map, a grapheme is normalized
     * with use of `mapGrapheme` function. Typically, it would be useful when you
     * want to specify same glyphs for both upper-case and lower-case characters,
     * so you are able to define lower-case ones only and then implement
     * `mapGrapheme` as `grapheme.toLowerCase()`.
     */
    glyphs: Map<string, BpxGlyph>;
};
/**
 * An instance of a font, defined with use of {@link BpxFontConfig}.
 *
 * @see https://github.com/beetrootpaul/beetpx-examples/tree/main/fonts
 *
 * @category Fonts
 */
declare class BpxFont {
    #private;
    /**
     * A method to create a font from scratch.
     *
     * @group Static factories
     */
    static of(config: Partial<BpxFontConfig>): BpxFont;
    /**
     * A method to create a font as an extension of an already defined font.
     *
     * @example
     * ```ts
     * const pico8FontWithExtraGlyphs = BpxFont.basedOn($font_pico8, baseFontConfig => ({
     *   ...baseFontConfig,
     *   glyphs: new Map<string, BpxGlyph>([
     *     ...baseFontConfig.glyphs,
     *     // additional glyphs defined here
     *   ]),
     * });
     * ```
     *
     * @group Static factories
     */
    static basedOn(baseFont: BpxFont, extendedConfig: (baseFontConfig: BpxFontConfig) => BpxFontConfig): BpxFont;
    private constructor();
    /**
     * A list of sprite sheets gathered from the all sprite glyphs defined for this font.
     *
     * Useful for defining the assets to fetch in {@link BeetPx.start}
     *
     * @example
     * ```ts
     * $x.start({
     *   // ...
     *   assets: [
     *     ...myFont.spriteSheetUrls
     *   ],
     * })
     * ```
     */
    get spriteSheetUrls(): string[];
    /**
     * @see {@link BpxFontConfig.ascent}
     */
    get ascent(): number;
    /**
     * @see {@link BpxFontConfig.descent}
     */
    get descent(): number;
    /**
     * @see {@link BpxFontConfig.lineGap}
     */
    get lineGap(): number;
    /**
     * The main methods of the font, which iterates of the text segments (characters, but with a support
     * for multi-char emojis, e.g. "❤️"), and arranges their corresponding glyphs in a virtual visual space.
     *
     * The resulting array of {@link BpxArrangedGlyph} is further used by {@link BeetPxDraw.measureText}
     * for a headless text rendering and by {@link BeetPxDraw.text} for an actual text rendering.
     *
     * You rather doesn't have to use this method directly.
     */
    arrangeGlyphsFor(text: string, textColor: BpxRgbColor, colorMarkers?: BpxTextColorMarkers): BpxArrangedGlyph[];
}

/**
 * @see {@link $aspr}
 *
 * @category Drawing
 */
type BpxImageBoundAnimatedSpriteFactory = (w: number, h: number, xys: [x: number, y: number][], opts?: {
    frameDuration?: number;
    paused?: boolean;
    onGamePause?: "pause" | "ignore";
}) => BpxAnimatedSprite;
/**
 * A definition of an animated sprite,
 * which can later be used (indirectly) for drawing by {@link BeetPxDraw.sprite}.
 *
 * It has a form of a collection sprites, originated from the
 * same sprite sheet.
 *
 * @example
 * ```ts
 * let myAnimation: BpxAnimatedSprite;
 *
 * $x.setOnStarted(() => {
 *   myAnimation = $aspr("spritesheet.png")(8, 8, [
 *     [0,0],
 *     [8,0],
 *     [16,0],
 *   ]);
 * });
 *
 * $d.setOnDraw(() => {
 *   $d.sprite(myAnimation.current, $v(10));
 * });
 * ```
 *
 * @remarks
 * Under the hood this class uses {@link BpxTimer} to integrate
 * the animation progression with the game loop.
 *
 * @see {@link $aspr}
 *
 * @category Drawing
 */
declare class BpxAnimatedSprite {
    #private;
    /**
     * @see {@link $aspr}
     *
     * @group Static factories
     */
    static from(imageUrl: BpxImageUrl, w: number, h: number, xys: [x: number, y: number][], opts?: {
        frameDuration?: number;
        paused?: boolean;
        onGamePause?: "pause" | "ignore";
    }): BpxAnimatedSprite;
    /**
     * A property helpful for TypeScript type inference, when distinguishing from
     * other types of sprites.
     *
     * @example
     * ```ts
     * const s: BpxSprite | BpxAnimatedSprite = getSprite();
     * if (s.type === "static") {
     *   // s is BpxSprite here
     * } else if (s.type === "animated") {
     *   // s is BpxAnimatedSprite here
     * } else {
     *   $u.assertUnreachable(s);
     * }
     * ```
     */
    readonly type = "animated";
    readonly imageUrl: BpxImageUrl;
    readonly size: BpxVector2d;
    private constructor();
    /**
     * A sprite to be drawn in the current game loop iteration.
     */
    get current(): BpxSprite;
    /**
     * An index of the sprite from the list of sprites of this animation.
     */
    get t(): number;
    /**
     * Pauses the animation.
     */
    pause(): void;
    /**
     * Resumes the animation.
     */
    resume(): void;
    /**
     * Restarts the animation from its first frame.
     */
    restart(): void;
}

/**
 * A 4x4 drawing pattern definition of which pixels should be drawn with the `primary`
 * and which with the `secondary` of {@link BpxPatternColors}.
 *
 * @example
 * ```ts
 * const prevPattern = $d.setDrawingPattern(BpxDrawingPattern.from(`
 *   ##--
 *   ##--
 *   --##
 *   --##
 * `));
 * $d.rectFilled($v(10), $v(20), BpxPatternColors.of($rgb_red, $rgb_blue));
 * $d.setDrawingPattern(prevPattern);
 * ```
 *
 * @category Drawing
 */
declare class BpxDrawingPattern {
    #private;
    /**
     * Creates a BpxDrawingPattern from a visual representation of 4 columns and 4 rows
     *   (designated by new lines) where `#` and `-` stand for a primary and
     *   a secondary color. Whitespaces are ignored.
     *
     * @category Static factories
     */
    static from(ascii: string): BpxDrawingPattern;
    /**
     * Creates a BpxDrawingPattern from a numeric representation of 4 columns and 4 rows.
     * Recommended way is to defined the pattern as a binary number, with group separator
     * put between each 4 digits, e.g. `0b0101_1010_0101_1010`. The `1` stands for the primary
     * color and the `0` – for the secondary one.
     *
     * @category Static factories
     */
    static of(bits: number): BpxDrawingPattern;
    /**
     * The pattern used by default, which uses the primary color only.
     * An equivalent of `BpxDrawingPattern.of(0b1111_1111_1111_1111)`.
     *
     * @category Static values
     */
    static primaryOnly: BpxDrawingPattern;
    /**
     * The pattern which uses the secondary color only.
     * An equivalent of `BpxDrawingPattern.of(0b0000_0000_0000_0000)`.
     *
     * @category Static values
     */
    static secondaryOnly: BpxDrawingPattern;
    private constructor();
    /**
     * The method to check whether a primary or a secondary color should be put at a given (X,Y)
     * when this pattern is applied.
     *
     * Usually, you wouldn't have to use this method, since it's already used by internals of
     * BeetPx drawing API.
     */
    hasPrimaryColorAt(x: number, y: number): boolean;
}

/**
 * Text measurement calculated by a headless text rendering with use of
 * {@link BeetPxDraw.measureText}.
 *
 * @category Drawing
 */
type BpxTextMeasurement = {
    /** The size of the drawn text. */
    wh: BpxVector2d;
    /** The offset of the text placement in relation to where it was intended to be placed. Useful when the text is meant to be drawn centered, so it starts half of its width/height to the left/up from the given point. */
    offset: BpxVector2d;
};

/**
 * @see {@link BpxEngineConfig}'s `debugMode.fpsDisplay.placement`
 *
 * @category Debug
 */
type BpxFpsDisplayPlacement = "top-left" | "top-right" | "bottom-left" | "bottom-right";

/**
 * Identifiers of the game buttons.
 *
 * @example
 * ```ts
 * $x.wasButtonJustPressed("X");
 * ```
 *
 * @remarks
 * - `O` represents the Japanese "Maru" sign, kind of a "Yes". Good for a primary/accept/next button.
 * - `X` represents the Japanese "Batsu" sign, kind of a "No". Good for a secondary/cancel/back button.
 * - Lower case `o` and `x` are supported as well, for a convenience.
 *
 * @category Game input
 */
type BpxGameButtonName = "left" | "right" | "up" | "down" | "O" | "o" | "X" | "x" | "menu";

/**
 * @see {@link BeetPx.getConnectedGamepadTypes}
 *
 * @category Game input
 */
type BpxGamepadType = "xbox" | "dualsense" | "8bitdo" | "other";

/**
 * @see {@link BeetPx.getRecentInputMethods}
 *
 * @category Game input
 */
type BpxGameInputMethod = "gamepad" | "keyboard" | "mouse" | "touch";
/**
 * Identifiers of the game input events.
 *
 * Typically you wouldn't need to use those type values unless dealing
 * with custom even handling.
 *
 * @see {@link BeetPx.getEventsCapturedInLastUpdate}
 *
 * @category Game input
 */
type BpxGameInputEvent = null | "button_left" | "button_right" | "button_up" | "button_down" | "button_O" | "button_X" | "button_menu" | "mute_unmute_toggle" | "full_screen" | "take_screenshot" | "browse_screenshots_toggle" | "debug_toggle" | "frame_by_frame_toggle" | "frame_by_frame_step";

declare global {
    interface Document {
        webkitFullscreenEnabled?: boolean;
        webkitFullscreenElement?: () => Element;
        webkitExitFullscreen?: () => void;
    }
    interface Element {
        webkitRequestFullscreen?: () => void;
    }
}

/**
 * A simple JSON-like type constraint for values that can be persisted with use of
 * {@link BeetPx.savePersistedState}.
 *
 * @category Storage
 */
type BpxPersistedStateValueConstraints = Record<string, string | number | boolean | null | undefined>;

/**
 * The configuration of the BeetPx engine. Passed into {@link BeetPx.start}.
 *
 * @category Core
 */
type BpxEngineConfig = {
    /**
     * Used for scoping localStorage keys, so two different games won't override their persisted state.
     *
     * An example: built-in screenshots feature binds screenshots to the proper game by its `gameId`.
     */
    gameId: string;
    /**
     * The logical canvas size. Not to be mistaken with a size of the HTML Canvas, which the user has no control over.
     *
     * During the game, this value (as a {@link BpxVector2d} can be obtained with {@link BeetPx.canvasSize}.
     */
    canvasSize?: "64x64" | "128x128" | "256x256";
    /**
     * The desired frequency of update calls. This is a basis for all time-based computations
     * in the game, since BeetPx has no notion of the real time, nor delta time between update calls.
     * The entire engine is based in a fixed timestep computations, where you can expect each game loop
     * iteration to happen after the similar amount of time from the previous one.
     *
     * 60 FPS games looks smoother, but require more performant machine, if the game logic is
     * computation heavy.
     *
     * PleaseThis setting does *not* imply the rendering FPS, which is decoupled from the update calls.
     */
    fixedTimestep?: "30fps" | "60fps";
    /**
     * A list of URLs of assets to load. The URLs might be either relative to the `./public/` directory,
     * or external ones.
     *
     * Allowed file extensions:
     * - `.png` – for images,
     * - `.wav` – for music,
     * - `.flac` – for music, smaller files than `.wav`,
     * - `.json` – for JSON files,
     * - `.ldtk` – a convenience extension support for JSON files with the default extension used by [LDtk](https://ldtk.io/) tool, so you doesn't have to rename them.
     *
     * @example
     * ```ts
     * $x.start({
     *   // ...
     *   assets: [
     *     "spriteshet.png",    // refers to `./public/spriteshet.png`
     *     "music/track1.flac", // refers to `./public/music/track1.flac`
     *     "https://the.url/of/level.ldtk",
     *   ],
     * });
     * ```
     */
    assets?: BpxAssetsToLoad;
    /**
     * A feature which allows to toggle a game pause with use of a "menu" button.
     * When active, the timers, animations, and music do not progress, unless configured to ignore the pause.
     *
     * This also allows to implement a pause menu.
     *
     * @example
     * ```ts
     * $x.setOnDraw(() => {
     *   // ...
     *   if ($x.isPaused) {
     *     pauseMenu.draw();
     *   }
     * });
     * ```
     *
     * @see https://github.com/beetrootpaul/beetpx-examples/tree/main/pause-and-restart
     */
    gamePause?: {
        /**
         * Whether the game pause should be available (and automatically toggled with the "menu" button).
         */
        available?: boolean;
    };
    /**
     * Whether to prevent user from accidentally closing the browser tab with the game running.
     *
     * A recommended approach would be to set it to {@link BEETPX__IS_PROD}
     *
     * @example
     * ```ts
     * $x.start({
     *   // ...,
     *   requireConfirmationOnTabClose: BEETPX__IS_PROD,
     * });
     * ```
     */
    requireConfirmationOnTabClose?: boolean;
    screenshots?: {
        /**
         * Whether to allow user to take screenshots of the game (with use of the `]` key)
         * and access the screenshot browser overlay (with use of the `}` key).
         */
        available?: boolean;
    };
    /**
     * A mode in which you can perform an additional logic, draw helpful markers, etc.
     * When active, the {@link BeetPx.debug} returns `true`.
     *
     * Visually, this mode is indicated by an orange border around the game canvas.
     *
     * When inactive, the {@link BeetPx.logDebug} are not printed.
     *
     * @example
     * ```ts
     * $d.sprite(playerSprite, xy);
     * if ($x.debug) {
     *   $d.rect(xy, playerSprite.size, $rgb_red);
     * }
     * ```
     */
    debugMode?: {
        /**
         * Whether to allow use to toggle the debug mode (with use of the `;` key).
         *
         * A recommended approach would be to set it to the negation of {@link BEETPX__IS_PROD}.
         */
        available?: boolean;
        /**
         * Whether to activate the debug mode from the game start. Useful, when you
         * want to investigate what happens on the very first frame. This setting ignores
         * the persisted state of whether the debug mode was activated the last time the games was run.
         */
        forceEnabledOnStart?: boolean;
        /**
         * FPS Display shows the rendering FPS in one of the canvas corners, when in enabled and in the debug mode.
         */
        fpsDisplay?: {
            /**
             * Whether the FPS Display should be shown in the debug mode.
             */
            enabled?: boolean;
            /**
             * The color of the printed FPS on the canvas.
             */
            color?: BpxRgbColor;
            /**
             * The placement of the printed FPS on the canvas.
             */
            placement?: BpxFpsDisplayPlacement;
        };
    };
    frameByFrame?: {
        /**
         * Whether to allow use to toggle the frame-by-frame mode (with use of the `,` key),
         * and (when in that mode) to progress to the next frame (with use of the `.` key).
         *
         * A recommended approach would be to set it to the negation of {@link BEETPX__IS_PROD}.
         */
        available?: boolean;
        /**
         * Whether to activate the frame-by-frame mode from the game start. Useful, when you
         * want to investigate what happens on the very first frame.
         */
        activateOnStart?: boolean;
    };
};

/**
 * @category Miscellaneous
 */
type BpxEasingFn = (t: number) => number;
/**
 * A collection of easing functions. Based on
 * ["Animation Curves cheat sheet/library" PICO-8 cart by ValerADHD](https://www.lexaloffle.com/bbs/?tid=40577).
 *
 * @category Miscellaneous
 */
declare class BpxEasing {
    private constructor();
    /**
     * @group Static values
     */
    static linear: BpxEasingFn;
    /**
     * @group Static values
     */
    static inQuadratic: BpxEasingFn;
    /**
     * @group Static values
     */
    static outQuadratic: BpxEasingFn;
    /**
     * @group Static values
     */
    static inOutQuadratic: BpxEasingFn;
    /**
     * @group Static values
     */
    static outInQuadratic: BpxEasingFn;
    /**
     * @group Static values
     */
    static inQuartic: BpxEasingFn;
    /**
     * @group Static values
     */
    static outQuartic: BpxEasingFn;
    /**
     * @group Static values
     */
    static inOutQuartic: BpxEasingFn;
    /**
     * @group Static values
     */
    static outInQuartic: BpxEasingFn;
    /**
     * @group Static values
     */
    static inOvershoot: BpxEasingFn;
    /**
     * @group Static values
     */
    static outOvershoot: BpxEasingFn;
    /**
     * @group Static values
     */
    static inOutOvershoot: BpxEasingFn;
    /**
     * @group Static values
     */
    static outInOvershoot: BpxEasingFn;
    /**
     * @group Static values
     */
    static inElastic: BpxEasingFn;
    /**
     * @group Static values
     */
    static outElastic: BpxEasingFn;
    /**
     * @group Static values
     */
    static inOutElastic: BpxEasingFn;
    /**
     * @group Static values
     */
    static outInElastic: BpxEasingFn;
    /**
     * @group Static values
     */
    static inBounce: BpxEasingFn;
    /**
     * @group Static values
     */
    static outBounce: BpxEasingFn;
}

/**
 * A free to use (CC-0) color palette created by zep and distributed as part of PICO-8 fantasy console.
 *
 * Links:
 *  - https://www.lexaloffle.com/pico-8.php?page=faq – an info about the palette being available under a CC-0 license
 *  - https://pico-8.fandom.com/wiki/Palette#The_system_palette – hex values are copy-pasted from there
 *
 * @category Colors
 */
declare class BpxPalettePico8 {
    private constructor();
    /**
     * Color `#000000`.
     *
     * @group Static values
     */
    static black: BpxRgbColor;
    /**
     * Color `#1D2B53`.
     *
     * @group Static values
     */
    static storm: BpxRgbColor;
    /**
     * Color `#7E2553`.
     *
     * @group Static values
     */
    static wine: BpxRgbColor;
    /**
     * Color `#008751`.
     *
     * @group Static values
     */
    static moss: BpxRgbColor;
    /**
     * Color `#AB5236`.
     *
     * @group Static values
     */
    static tan: BpxRgbColor;
    /**
     * Color `#5F574F`.
     *
     * @group Static values
     */
    static slate: BpxRgbColor;
    /**
     * Color `#C2C3C7`.
     *
     * @group Static values
     */
    static silver: BpxRgbColor;
    /**
     * Color `#FFF1E8`.
     *
     * @group Static values
     */
    static white: BpxRgbColor;
    /**
     * Color `#FF004D`.
     *
     * @group Static values
     */
    static ember: BpxRgbColor;
    /**
     * Color `#FFA300`.
     *
     * @group Static values
     */
    static orange: BpxRgbColor;
    /**
     * Color `#FF004D`.
     *
     * @group Static values
     */
    static lemon: BpxRgbColor;
    /**
     * Color `#00E436`.
     *
     * @group Static values
     */
    static lime: BpxRgbColor;
    /**
     * Color `#29ADFF`.
     *
     * @group Static values
     */
    static sky: BpxRgbColor;
    /**
     * Color `#83769C`.
     *
     * @group Static values
     */
    static dusk: BpxRgbColor;
    /**
     * Color `#FF77A8`.
     *
     * @group Static values
     */
    static pink: BpxRgbColor;
    /**
     * Color `#FFCCAA`.
     *
     * @group Static values
     */
    static peach: BpxRgbColor;
}

/**
 * A free to use (CC-0) font created by zep and distributed as part of PICO-8 fantasy console.
 *
 * Links:
 *  - https://www.lexaloffle.com/pico-8.php?page=faq – an info about the font being available under a CC-0 license
 *
 *  @category Fonts
 */
declare class BpxFontConfigPico8 implements BpxFontConfig {
    #private;
    /**
     * @group Static values
     */
    static readonly spriteSheetUrl = "beetpx/pico-8-font.png";
    ascent: number;
    descent: number;
    lineGap: number;
    mapGrapheme(grapheme: string): string;
    glyphs: Map<string, BpxGlyph>;
}

/**
 * A free to use (CC-0) font created by saint11 and distributed on https://saint11.org/blog/fonts/
 *
 * Note: only a subset of characters is implemented here:
 * ```
 * . : ! ? ' " * / + -
 * 0 1 2 3 4 5 6 7 8 9
 * % $ ( ) [ ] { } < >
 * A B C D E F G H I J K L M
 * N O P Q R S T U V W X Y Z
 * a b c d e f g h i j k l m      (note: both upper- and lower-case
 * n o p q r s t u v w x y z             characters use same glyphs)
 * ```
 * @category Fonts
 */
declare class BpxFontConfigSaint11Minimal4 implements BpxFontConfig {
    #private;
    ascent: number;
    descent: number;
    lineGap: number;
    mapGrapheme(grapheme: string): string;
    glyphs: Map<string, BpxGlyph>;
}

/**
 * A free to use (CC-0) font created by saint11 and distributed on https://saint11.org/blog/fonts/
 *
 * Note: only a subset of characters is implemented here:
 * ```
 * . : ! ? ' " * / + -
 * 0 1 2 3 4 5 6 7 8 9
 * % $ ( ) [ ] { } < >
 * A B C D E F G H I J K L M
 * N O P Q R S T U V W X Y Z
 * a b c d e f g h i j k l m
 * n o p q r s t u v w x y z
 * ```
 *
 *  @category Fonts
 */
declare class BpxFontConfigSaint11Minimal5 implements BpxFontConfig {
    #private;
    ascent: number;
    descent: number;
    lineGap: number;
    mapGrapheme(grapheme: string): string;
    glyphs: Map<string, BpxGlyph>;
}

/**
 * A class used to detect the {@link BpxGamepadType} of a given Gamepad.
 * It's used by BeetPx internals to decide which gamepad mapping to use,
 * but you might also want to use it for in your game if needed (e.g.
 * to decide which sprite of the gamepad button to show on the controls
 * screen).
 *
 * @example
 * ```ts
 * window.addEventListener("gamepadconnected", (gamepadEvent) => {
 *   $x.logDebug(`Connected: ${BpxGamepadTypeDetector.detect(gamepadEvent.gamepad))}`);
 * });
 * ```
 * @category Game input
 */
declare class BpxGamepadTypeDetector {
    private constructor();
    /**
     * @group Static methods
     */
    static detect(gamepad: Gamepad): BpxGamepadType;
}

/**
 * A timer implementation, tightly integrated with the game loop.
 * It automatically counts frames – an amount of update calls.
 *
 * Used as a basis for {@link BpxAnimatedSprite}.
 *
 * @see {@link $timer}
 *
 * @category Core
 */
declare class BpxTimer {
    #private;
    /**
     * @see {@link $timer}
     *
     * @group Static factories
     */
    static of(opts: {
        frames: number;
        loop: boolean;
        paused: boolean;
        delayFrames: number;
        onGamePause: "pause" | "ignore";
    }): BpxTimer;
    private constructor();
    /**
     * A current counted frame number, incrementing from 0.
     */
    get t(): number;
    /**
     * A an amount of frames left to be counted, decrementing down to 0.
     */
    get framesLeft(): number;
    /**
     * A progress of the counting, gradually incrementing from 0 to 1.
     */
    get progress(): number;
    /**
     * Whether this timer has finished already.
     * For looped timers this becomes `true` forever after the first pass.
     */
    get hasFinished(): boolean;
    /**
     * Whether this timer has finished in the most recent game loop iteration.
     * For looped timers this becomes `true` at the end of each pass.
     */
    get hasJustFinished(): boolean;
    /**
     * Pauses the timer.
     */
    pause(): void;
    /**
     * Resumes the timer.
     */
    resume(): void;
    /**
     * Restarts the timer from 0.
     */
    restart(): void;
}

/**
 * A timer sequence, which is a more advanced version of the {@link BpxTimer}.
 * It allows to define a complex set of intervals and looping with use
 * of multiple `intro` and `loop` phases.
 *
 * @see {@link $timerSeq}
 *
 * @category Core
 */
declare class BpxTimerSequence<TPhaseName extends string> {
    #private;
    /**
     * @see {@link $timerSeq}
     *
     * @group Static factories
     */
    static of<TPhaseName extends string>(params: {
        intro: Array<[phase: TPhaseName, frames: number]>;
        loop: Array<[phase: TPhaseName, frames: number]>;
    }, opts: {
        paused: boolean;
        delayFrames: number;
        onGamePause: "pause" | "ignore";
    }): BpxTimerSequence<TPhaseName>;
    private constructor();
    /**
     * The name of the phase which has finished in the recent game loop iteration.
     */
    get justFinishedPhase(): TPhaseName | null;
    /**
     * The name of the currently counted phase.
     */
    get currentPhase(): TPhaseName | null;
    /**
     * A current counted frame number within the current phase, incrementing from 0.
     */
    get t(): number;
    /**
     * A progress of the counting for the current phase, gradually incrementing from 0 to 1.
     */
    get progress(): number;
    /**
     * A an amount of frames left to be counted in the current phase, decrementing down to 0.
     */
    get framesLeft(): number;
    /**
     * A current counted frame number for the entire sequence (intro + 1 loop pass),
     * incrementing from 0.
     * After the first loop pass, the intro is no longer taken into account in the calculation.
     */
    get tOverall(): number;
    /**
     * A an amount of frames left to be counted for the entire sequence (intro + 1 loop pass),
     * decrementing down to 0.
     * After the first loop pass, the intro is no longer taken into account in the calculation.
     */
    get framesLeftOverall(): number;
    /**
     * A progress of the counting for the entire sequence (intro + 1 loop pass),
     * gradually incrementing from 0 to 1.
     * After the first loop pass, the intro is no longer taken into account in the calculation.
     */
    get progressOverall(): number;
    /**
     * Whether this timer has finished already the entire sequence (intro + 1 loop pass).
     * This becomes `true` forever afterwards.
     */
    get hasFinishedOverall(): boolean;
    /**
     * Whether this timer has finished the entire sequence (intro + 1 loop pass)
     * in the most recent game loop iteration.
     * After the first loop pass, the intro is no longer taken into account.
     */
    get hasJustFinishedOverall(): boolean;
    /**
     * Pauses the timer.
     */
    pause(): void;
    /**
     * Resumes the timer.
     */
    resume(): void;
    /**
     * Restarts the timer from 0.
     */
    restart(): void;
}

/**
 * One of 3 main API entry points. This one provides you with the most of
 * the BeetPx capabilities, except drawing.
 *
 * @example
 * ```ts
 * BeetPx.setOnUpdate(() => {
 *   BeetPx.logInfo(BeetPx.isAnyButtonPressed());
 * });
 * ```
 *
 * @category API entry points
 */
declare class BeetPx {
    #private;
    private constructor();
    /**
     * The method which starts the game.
     *
     * You are supposed to set {@link BeetPx.setOnStarted},
     * {@link BeetPx.setOnUpdate}, and {@link BeetPx.setOnDraw} before this one.
     *
     * @example
     * ```ts
     * $x.setOnStarted(() => {
     *   // ...
     * });
     *
     * $x.setOnUpdate(() => {
     *   // ...
     * });
     *
     * $x.setOnDraw(() => {
     *   // ...
     * });
     *
     * $x.start({
     *   gameId: "my-game",
     *   // ...
     * });
     * ```
     *
     * @category Game loop
     */
    static start(config: BpxEngineConfig): Promise<void>;
    /**
     * Let's you know whether the debug mode is on or off. To be used in combination with:
     * - {@link BpxEngineConfig}'s `debugMode.available` set to `true`
     * - `;` key used to toggle the debug mode on/off
     *
     * @category Debug
     */
    static get debug(): boolean;
    /**
     * The canvas size as set in {@link BpxEngineConfig}'s `canvasSize`.
     *
     * @category Graphics
     */
    static get canvasSize(): BpxVector2d;
    /**
     * Number of frames processed since game started.
     * It gets reset to 0 when {@link BeetPx.restart} is called.
     * It counts update calls, not draw calls.
     *
     * Usually you would use e.g. {@link $timer} instead of this low-level API.
     *
     * @category Game loop
     */
    static get frameNumber(): number;
    /**
     * Number of frames processed since game started, excluding the frames which happened during an active game pause.
     * It gets reset to 0 when {@link BeetPx.restart} is called.
     * It counts update calls, not draw calls.
     *
     * Usually you would use e.g. {@link $timer} instead of this low-level API.
     *
     * @category Game loop
     */
    static get frameNumberOutsidePause(): number;
    /**
     * The effective FPS (frames per second) of render calls. This does *not* count the update calls.
     *
     * This value is used (with some averaging, to avoid quickly changing number) in the FPS display,
     * which is active in debug mode if {@link BpxEngineConfig}'s
     * `debugMode.fpsDisplay.enabled` is set to `true`.
     *
     * @category Game loop
     */
    static get renderingFps(): number;
    /**
     * The type of a browser detected by the engine.
     * It is tightly related to the gamepad mapping detection.
     *
     * @see https://github.com/beetrootpaul/beetpx-examples/tree/main/input-tester
     *
     * @category Game input
     */
    static get detectedBrowserType(): BpxBrowserType;
    /**
     * The method to set an on-started callback which is called every time the game is (re-)started.
     *
     * While the game starts only once, it can be restarted many time with use of {@link BeetPx.restart}.
     * In such case, the callback is useful for clearing up the game state, so nothing from the previous
     * gameplay remains.
     *
     * The timers, animations, and music restart on their own, there is no manual action needed.
     *
     * The on-started callback is one of 2 recommended places to use `BeetPxDraw` methods within
     * (the other one is the draw callback set by {@link BeetPx.setOnDraw}).
     *
     * @example
     * ```ts
     * const inputManager = MySpecialInputManager();
     * let gameLogic: MyComplexGameLogic;
     *
     * $x.setOnStarted(() => {
     *   gameLogic = new MyComplexGameLogic();
     *   inputManager.reset();
     * });
     *
     * $x.setOnUpdate(() => {
     *   // ...
     * });
     *
     * $x.setOnDraw(() => {
     *   // ...
     * });
     *
     * $x.start({
     *   // ...
     * });
     * ```
     *
     * @category Game loop
     */
    static setOnStarted(onStarted?: () => void): void;
    /**
     * The method to set an update callback which is called on every iteration of the game loop,
     * on a fixed timestep.
     *
     * @example
     * ```ts
     * const speed = 6;
     * let player;
     *
     * $x.setOnStarted(() => {
     *   // ...
     * });
     *
     * $x.setOnUpdate(() => {
     *   player.setPosition(
     *     player.position.mul($x.getPressedDirection()).mul(speed)
     *   );
     * });
     *
     * $x.setOnDraw(() => {
     *   // ...
     * });
     *
     * $x.start({
     *   // ...
     * });
     * ```
     *
     * @see {@link BpxEngineConfig.fixedTimestep}
     *
     * @category Game loop
     */
    static setOnUpdate(onUpdate?: () => void): void;
    /**
     * The method to set a draw callback which is called every time the browser has a chance to repaint the canvas
     * ([requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) is used
     * under the hood).
     *
     * The draw callback is one of 2 recommended places to use `BeetPxDraw` methods within
     * (the other one is the on-started callback set by {@link BeetPx.setOnStarted}).
     *
     * @example
     * ```ts
     * $x.setOnStarted(() => {
     *   // ...
     * });
     *
     * $x.setOnUpdate(() => {
     *   // ...
     * });
     *
     * $x.setOnDraw(() => {
     *   $d.clearCanvas($rgb_blue);
     *   $d.pixel($v(10,20), $rgb_red);
     * });
     *
     * $x.start({
     *   // ...
     * });
     * ```
     *
     * @see {@link BpxEngineConfig.fixedTimestep}
     *
     * @category Game loop
     */
    static setOnDraw(onDraw?: () => void): void;
    /**
     * Restarts the entire game.
     *
     * It is important to properly set the game initialization logic through the {@link BeetPx.setOnStarted},
     * so the `$x.restart()` will result with a properly restarted game.
     *
     * An example usage would be to implement a game pause menu, with the "restart the game" as
     * one of available options.
     *
     * @category Game loop
     */
    static restart(): void;
    /**
     * Prints to the console on the debug level, with use of `console.debug`.
     * This one is run only in the debug mode.
     *
     * You can implement {@link BpxPrintDebug} on a given object if you want
     * it to be printed out in a custom way.
     *
     * @see {@link BpxEngineConfig.debugMode}
     * @see {@link BpxPrintDebug}
     *
     * @category Logging
     */
    static logDebug(...args: unknown[]): void;
    /**
     * Prints to the console on the info level, with use of `console.info`.
     *
     * You can implement {@link BpxPrintDebug} on a given object if you want
     * it to be printed out in a custom way.
     *
     * @see {@link BpxPrintDebug}
     *
     * @category Logging
     */
    static logInfo(...args: unknown[]): void;
    /**
     * Prints to the console on the warn level, with use of `console.warn`.
     *
     * You can implement {@link BpxPrintDebug} on a given object if you want
     * it to be printed out in a custom way.
     *
     * @see {@link BpxPrintDebug}
     *
     * @category Logging
     */
    static logWarn(...args: unknown[]): void;
    /**
     * Prints to the console on the error level, with use of `console.error`.
     *
     * You can implement {@link BpxPrintDebug} on a given object if you want
     * it to be printed out in a custom way.
     *
     * @see {@link BpxPrintDebug}
     *
     * @category Logging
     */
    static logError(...args: unknown[]): void;
    /**
     * Whether the game pause is active.
     *
     * @see https://github.com/beetrootpaul/beetpx-examples/tree/main/pause-and-restart
     *
     * @category Game pause
     */
    static get isPaused(): boolean;
    /**
     Whether the game pause was activated in the most recent game loop iteration.
     *
     * @see https://github.com/beetrootpaul/beetpx-examples/tree/main/pause-and-restart
     *
     * @category Game pause
     */
    static get wasJustPaused(): boolean;
    /**
     Whether the game pause was deactivated in the most recent game loop iteration.
     *
     * @see https://github.com/beetrootpaul/beetpx-examples/tree/main/pause-and-restart
     *
     * @category Game pause
     */
    static get wasJustResumed(): boolean;
    /**
     * Pauses the game. This works only if {@link BpxEngineConfig.gamePause}'s `available` is set to `true`.
     *
     * The game pauses is by default toggled with the "menu" button, but this method allows you
     * to add other ways of activating the pause.
     *
     * @see https://github.com/beetrootpaul/beetpx-examples/tree/main/pause-and-restart
     *
     * @category Game pause
     */
    static pause(): void;
    /**
     * Resumes the game. This works only if {@link BpxEngineConfig.gamePause}'s `available` is set to `true`.
     *
     * The game pauses is by default toggled with the "menu" button, but this method allows you
     * to add other ways of deactivating the pause.
     *
     * @see https://github.com/beetrootpaul/beetpx-examples/tree/main/pause-and-restart
     *
     * @category Game pause
     */
    static resume(): void;
    /**
     * Tells whether any of the game buttons changed from released to pressed in the recent game loop iteration.
     *
     * @see For a list of available game buttons check {@link BpxGameButtonName}
     *
     * @category Game input
     */
    static wasAnyButtonJustPressed(): boolean;
    /**
     * Tells whether a given game button changed from released to pressed in the recent game loop iteration.
     *
     * @category Game input
     */
    static wasButtonJustPressed(button: BpxGameButtonName): boolean;
    /**
     * Tells whether a given game button changed from pressed to released in the recent game loop iteration.
     *
     * @category Game input
     */
    static wasButtonJustReleased(button: BpxGameButtonName): boolean;
    /**
     * Tells whether any of the game buttons is pressed right now.
     *
     * @see For a list of available game buttons check {@link BpxGameButtonName}
     *
     * @category Game input
     */
    static isAnyButtonPressed(): boolean;
    /**
     * Tells whether a given button is pressed right now.
     *
     * @category Game input
     */
    static isButtonPressed(button: BpxGameButtonName): boolean;
    /**
     * Returns a 2D vector where:
     * - X=-1 means the up is pressed,
     * - X=0 means neither up nor down is pressed or both are pressed at the same time,
     * - X=1 means the down is pressed,
     * - Y=-1 means the left is pressed,
     * - Y=0 means neither left nor right is pressed or both are pressed at the same time,
     * - Y=1 means the right is pressed.
     *
     * @example
     * ```ts
     * this.position += $x.getPressedDirection().mul(this.speed);
     * ```
     *
     * @category Game input
     */
    static getPressedDirection(): BpxVector2d;
    /**
     * Allows to enable repeating for a given button.
     * Repeating means if the user presses the button for a longer timer,
     * the "just pressed" state is detected first after `firstRepeatFrames`
     * frames, then repetitively after `loopedRepeatFrames` frames.
     *
     * @category Game input
     */
    static setButtonRepeating(button: BpxGameButtonName, repeating: {
        firstRepeatFrames: number | null;
        loopedRepeatFrames: number | null;
    }): void;
    /**
     * Tells what input methods were used in the last game loop iteration.
     *
     * Might be used to render in-game indications what button to press,
     * with their sprites chosen based on which input method was recently
     * used.
     *
     * @category Game input
     */
    static getRecentInputMethods(): Set<BpxGameInputMethod>;
    /**
     * Tells whether a current device has touch capabilities.
     *
     * @category Game input
     */
    static isTouchInputMethodAvailable(): boolean;
    /**
     * @category Game input
     */
    static getConnectedGamepadTypes(): Set<BpxGamepadType>;
    /**
     * A set of game input events captures since the last game loop iteration.
     *
     * Typically you wouldn't need to use those this method unless dealing
     * with custom even handling.
     *
     * @see https://github.com/beetrootpaul/beetpx-examples/tree/main/input-tester
     *
     * @category Game input
     */
    static getEventsCapturedInLastUpdate(): Set<BpxGameInputEvent>;
    /**
     * Checks if the audio is globally muted.
     *
     * @category Audio
     */
    static isAudioMuted(): boolean;
    /**
     * Mutes the audio globally.
     *
     * The global mute/unmute logic is independent from
     * {@link BeetPx.mutePlayback} and {@link BeetPx.unmutePlayback}.
     *
     * @category Audio
     */
    static muteAudio(opts?: {
        fadeOutMillis?: number;
    }): void;
    /**
     * Un-mutes the audio globally.
     *
     * The global mute/unmute logic is independent from
     * {@link BeetPx.mutePlayback} and {@link BeetPx.unmutePlayback}.
     *
     * @category Audio
     */
    static unmuteAudio(opts?: {
        fadeInMillis?: number;
    }): void;
    /**
     * Start to play a given sound, once.
     *
     * @returns - A {@link BpxAudioPlaybackId} of the started playback. Can be later used to e.g. mute this playback.
     *
     * @category Audio
     */
    static startPlayback(soundUrl: BpxSoundUrl, opts?: {
        muteOnStart?: boolean;
        onGamePause?: "pause" | "mute" | "ignore";
    }): BpxAudioPlaybackId;
    /**
     * Start to play a given sound, looped.
     *
     * @returns - A {@link BpxAudioPlaybackId} of the started playback. Can be later used to e.g. mute this playback.
     *
     * @category Audio
     */
    static startPlaybackLooped(soundUrl: BpxSoundUrl, opts?: {
        muteOnStart?: boolean;
        onGamePause?: "pause" | "mute" | "ignore";
    }): BpxAudioPlaybackId;
    /**
     * Start to play a given sound, defined by a sequence of audio samples.
     *
     * @see {@link BpxSoundSequence}
     *
     * @returns - A {@link BpxAudioPlaybackId} of the started playback. Can be later used to e.g. mute this playback.
     *
     * @category Audio
     */
    static startPlaybackSequence(soundSequence: BpxSoundSequence, opts?: {
        muteOnStart?: boolean;
        onGamePause?: "pause" | "mute" | "ignore";
    }): BpxAudioPlaybackId;
    /**
     * Mutes a given playback, denoted by its {@link BpxAudioPlaybackId}.
     *
     * @category Audio
     */
    static mutePlayback(playbackId: BpxAudioPlaybackId, opts?: {
        fadeOutMillis?: number;
    }): void;
    /**
     * Un-mutes a given playback, denoted by its {@link BpxAudioPlaybackId}.
     *
     * @category Audio
     */
    static unmutePlayback(playbackId: BpxAudioPlaybackId, opts?: {
        fadeInMillis?: number;
    }): void;
    /**
     * Completely stops a given playback, denoted by its {@link BpxAudioPlaybackId}.
     *
     * @category Audio
     */
    static stopPlayback(playbackId: BpxAudioPlaybackId, opts?: {
        fadeOutMillis?: number;
    }): void;
    /**
     * Pauses a given playback, denoted by its {@link BpxAudioPlaybackId}.
     *
     * @category Audio
     */
    static pausePlayback(playbackId: BpxAudioPlaybackId): void;
    /**
     * Resumes a given paused playback, denoted by its {@link BpxAudioPlaybackId}.
     *
     * @category Audio
     */
    static resumePlayback(playbackId: BpxAudioPlaybackId): void;
    /**
     * Gives access to the main global [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext).
     *
     * Typically, you wouldn't have to access to method on your own. But it might prove useful
     * to have it in some unexpected scenario.
     *
     * @category Audio
     */
    static getAudioContext(): AudioContext;
    /**
     * Tells whether it is possible to enter full screen on the current device and browser.
     *
     * It might be used e.g. for implementing a pause menu action to toggle full screen.
     *
     * @category Full screen
     */
    static isFullScreenSupported(): boolean;
    /**
     * Tells whether the game is currently in a full screen mode.
     *
     * It might be used e.g. for implementing a pause menu action to toggle full screen.
     *
     * @category Full screen
     */
    static isInFullScreen(): boolean;
    /**
     * Requests the game to either enter or exit the full screen mode.
     *
     * It might be used e.g. for implementing a pause menu action to toggle full screen.
     *
     * @category Full screen
     */
    static toggleFullScreen(): void;
    /**
     * Allows to persist some data between separate game runs.
     *
     * The stored data is kept in the
     * [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
     * It means it will be there as long as you the same web browser (with the same user profile active)
     * on the same machine, without clearing the website's data.
     *
     * @category Storage
     */
    static savePersistedState<PersistedStateValue extends BpxPersistedStateValueConstraints>(value: PersistedStateValue): void;
    /**
     * Allows to bring back the previously persisted data.
     *
     * The stored data is kept in the
     * [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
     * It means it will be there as long as you the same web browser (with the same user profile active)
     * on the same machine, without clearing the website's data.
     *
     * @category Storage
     */
    static loadPersistedState<PersistedStateValue extends BpxPersistedStateValueConstraints>(): Partial<PersistedStateValue> | null;
    /**
     * Allows to completely remove the previously persisted data.
     *
     * @category Storage
     */
    static clearPersistedState(): void;
    /**
     * Retrieves a previously fetched image.
     *
     * Usually, you wouldn't need to directly call this method,
     * as the image retrieval happens under the hood for operations
     * like sprite drawing.
     *
     * @see {@link BpxEngineConfig}'a `assets`
     *
     * @category Assets
     */
    static getImageAsset(imageUrl: BpxImageUrl): BpxImageAsset;
    /**
     * Retrieves a previously fetched sound.
     *
     * Usually, you wouldn't need to directly call this method,
     * as the sound retrieval happens under the hood for operations
     * like music playing.
     *
     * @see {@link BpxEngineConfig}'a `assets`
     *
     * @category Assets
     */
    static getSoundAsset(soundUrl: BpxSoundUrl): BpxSoundAsset;
    /**
     * Retrieves a previously fetched JSON.
     *
     * Right now there is no API which would make use of the fetched JSON under the hood.
     *
     * Example use case for this method is when you develop your game level in [LDtk](https://ldtk.io/)
     * and want to read the level's file in the game code.
     *
     * @see {@link BpxEngineConfig}'a `assets`
     *
     * @category Assets
     */
    static getJsonAsset(jsonUrl: BpxJsonUrl): BpxJsonAsset;
}
/**
 * A shorthand for {@link BeetPx}.
 *
 * @category API entry points
 */
declare const $x: typeof BeetPx;

/**
 * One of 3 main API entry points. This one provides you with the drawing
 * capabilities. Its methods are supposed to be called from either inside
 * {@link BeetPx.setOnStarted} or {@link BeetPx.setOnDraw} callback.
 *
 * @example
 * ```ts
 * BeetPx.setOnDraw(() => {
 *   BeetPxDraw.rectFilled($v(10), $v(20), $rgb_red);
 * });
 * ```
 *
 * @category API entry points
 */
declare class BeetPxDraw {
    #private;
    private constructor();
    /**
     * Fill the entire canvas with a given color. It's a method which you would typically
     * call as the very first inside {@link BeetPx.setOnDraw} in order to not clear the canvas
     * from what was drawn in the previous game loop iteration.
     *
     * @category General
     */
    static clearCanvas(color: BpxRgbColor): void;
    /**
     * Sets a clipping region, which is a rectangular boundary which limits all the subsequent drawing
     * to happen only within it.
     *
     * @returns Previous clipping region in form of an array: `[xy, wh]`
     *
     * @category General
     */
    static setClippingRegion(xy: BpxVector2d, wh: BpxVector2d): [xy: BpxVector2d, wh: BpxVector2d];
    /**
     * Removes the currently set clipping region, if any.
     *
     * @returns Previous clipping region in form of an array: `[xy, wh]`
     *
     * @category General
     */
    static removeClippingRegion(): [xy: BpxVector2d, wh: BpxVector2d];
    /**
     * Gets a XY (left-top corner) of a camera's view. Could be used e.g.
     * for drawing a game's HUD, or anything else that should be positioned against
     * the viewport and against the global game canvas' coordinates.
     *
     * @returns Current camera's XY.
     *
     * @category General
     */
    static get cameraXy(): BpxVector2d;
    /**
     * Sets a new XY (left-top corner) of a camera's view
     *
     * @example
     * ```ts
     * const prevCameraXy = $d.setCameraXy($v(50,50));
     * // draw something that requires the camera to be moved to (50,50)
     * $d.setCameraXy(prevCameraXy);
     * ```
     *
     * @returns Previous camera's XY.
     *
     * @category General
     */
    static setCameraXy(xy: BpxVector2d): BpxVector2d;
    /**
     * Sets a drawing pattern to use. A drawing pattern is a 4x4 definition of which
     * pixels should be drawn with the `primary` and which with the `secondary` of
     * {@link BpxPatternColors}.
     *
     * @example
     * ```ts
     * const prevPattern = $d.setDrawingPattern(BpxDrawingPattern.from(`
     *   ##--
     *   ##--
     *   --##
     *   --##
     * `));
     * $d.rectFilled($v(10), $v(20), BpxPatternColors.of($rgb_red, $rgb_blue));
     * $d.setDrawingPattern(prevPattern);
     * ```
     *
     * @returns Previously used pattern.
     *
     * @category General
     */
    static setDrawingPattern(pattern: BpxDrawingPattern): BpxDrawingPattern;
    /**
     * Draws a single colored pixel.
     *
     * @example
     * ```ts
     * $d.pixel($v(10,20), $rgb_red);
     * ```
     *
     * @category Shapes
     */
    static pixel(xy: BpxVector2d, color: BpxRgbColor): void;
    /**
     * Draws pixels based on a visual 2d representation, defined by {@link BpxPixels}.
     * Helpful for quickly drawing a shape that you don't have a sprite for in your spritesheet.
     *
     * @example
     * ```ts
     * $d.pixels(BpxPixels.from(`
     *   #####
     *   #-#-#
     *   #-#-#
     *   #####
     * `, $v(10,20), $rgb_red);
     * ```
     *
     * @category Shapes
     */
    static pixels(pixels: BpxPixels, xy: BpxVector2d, color: BpxRgbColor, opts?: {
        centerXy?: [boolean, boolean];
        scaleXy?: BpxVector2d;
        flipXy?: [boolean, boolean];
    }): void;
    /**
     * Draws a line.
     *
     * @see An implementation of Bresenham's Algorithm by Alois Zingl: http://members.chello.at/easyfilter/bresenham.html
     *
     * @category Shapes
     */
    static line(xy: BpxVector2d, wh: BpxVector2d, color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping): void;
    /**
     * Draws a rectangle, boundary only.
     *
     * @param xy Left-top corner.
     *
     * @category Shapes
     */
    static rect(xy: BpxVector2d, wh: BpxVector2d, color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping): void;
    /**
     * Draws a rectangle, filled.
     *
     * @param xy Left-top corner.
     *
     * @category Shapes
     */
    static rectFilled(xy: BpxVector2d, wh: BpxVector2d, color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping): void;
    /**
     * Draws a rectangle, boundary only, and fills the entire canvas *around* the rectangle.
     *
     * @param xy Left-top corner.
     *
     * @category Shapes
     */
    static rectOutsideFilled(xy: BpxVector2d, wh: BpxVector2d, color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping): void;
    /**
     * Draws an ellipse, boundary only.
     *
     * @see An implementation of Bresenham's Algorithm by Alois Zingl: http://members.chello.at/easyfilter/bresenham.html
     *
     * @param xy Left-top corner of a rectangle that the ellipse would fit into.
     *
     * @category Shapes
     */
    static ellipse(xy: BpxVector2d, wh: BpxVector2d, color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping): void;
    /**
     * Draws an ellipse, filled.
     *
     * @see An implementation of Bresenham's Algorithm by Alois Zingl: http://members.chello.at/easyfilter/bresenham.html
     *
     * @param xy Left-top corner of a rectangle that the ellipse would fit into.
     *
     * @category Shapes
     */
    static ellipseFilled(xy: BpxVector2d, wh: BpxVector2d, color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping): void;
    /**
     * Draws an ellipse, boundary only, and fills the entire canvas *around* the ellipse.
     *
     * @see An implementation of Bresenham's Algorithm by Alois Zingl: http://members.chello.at/easyfilter/bresenham.html
     *
     * @param xy Left-top corner of a rectangle that the ellipse would fit into.
     *
     * @category Shapes
     */
    static ellipseOutsideFilled(xy: BpxVector2d, wh: BpxVector2d, color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping): void;
    /**
     * Allows to define a color mapping from the sprite colors to the desired ones.
     *
     * @example
     * ```ts
     * const prevMapping = $d.setSpriteColorMapping(BpxSpriteColorMapping.from([
     *   [$rgb_red, $rgb_blue],
     * ]));
     * $d.sprite(mySprite, $v(10));
     * $d.setSpriteColorMapping(prevMapping);
     * ```
     *
     * @returns Previously used color mapping
     *
     * @category Sprites
     */
    static setSpriteColorMapping(spriteColorMapping: BpxSpriteColorMapping): BpxSpriteColorMapping;
    /**
     * Draws a given sprite.
     *
     * @example
     * ```ts
     * const mySprite = $spr("spritesheet.png")(8,8,0,0);
     * $d.sprite(mySprite, $v(10));
     * ```
     *
     * @category Sprites
     */
    static sprite(sprite: BpxSprite | BpxAnimatedSprite, xy: BpxVector2d, opts?: {
        centerXy?: [boolean, boolean];
        scaleXy?: BpxVector2d;
        flipXy?: [boolean, boolean];
    }): void;
    /**
     * Sets a font to be used for subsequent text drawing.
     *
     * @see https://github.com/beetrootpaul/beetpx-examples/tree/main/fonts
     *
     * @example
     * ```ts
     * const prevFont = $d.setFont($font_saint11Minimal4);
     * $d.text("hello!", $v(10), $rgb_red);
     * $d.setFont(prevFont);
     * ```
     *
     * @returns Previously used font
     *
     * @category Text
     */
    static setFont(font: BpxFont): BpxFont;
    /**
     * Sets color markers to be used for subsequent text drawing.
     * Color markers are used inside text to indicate places where a color should
     * change to another one.
     *
     * @example
     * ```ts
     * const prevMarkers = $d.setTextColorMarkers({
     *   red_theBest: $rgb_red,
     *   b: $rgb_blue,
     * });
     * $d.text("colors are: green, [b]blue, [red_theBest]red", $v(10), $rgb_green);
     * $d.setTextColorMarkers(prevMarkers);
     * ```
     *
     * @returns Previously used color markers
     *
     * @category Text
     */
    static setTextColorMarkers(textColorMarkers: BpxTextColorMarkers): BpxTextColorMarkers;
    /**
     * Measures the space that would be occupied by the text if it was drawn on the canvas.
     *
     * @example
     * ```ts
     * const line1Wh = $d.measureText(textLine1).wh;
     * const line2Wh = $d.measureText(textLine2).wh;
     * const line3Wh = $d.measureText(textLine3).wh;
     * const totalW = Math.max(line1Wh.x, line2Wh.x, line3Wh.x);
     * const totalH = line1Wh.y + line2Wh.y + line3Wh.y;
     * const leftTop = $x.canvasSize.div(2).sub(totalW / 2, totalH / 2)
     * ```
     *
     * @category Text
     */
    static measureText(text: string, opts?: {
        centerXy?: [boolean, boolean];
        scaleXy?: BpxVector2d;
    }): BpxTextMeasurement;
    /**
     * Draws a text.
     *
     * @example
     * ```ts
     * $d.text("hello!\nThe 2nd line", $v(10), $rgb_red);
     * ```
     *
     * @remarks
     * Use `\n` to split the text into multiple lines (aligned to the left).
     *
     * @category Text
     */
    static text(text: string, xy: BpxVector2d, color: BpxRgbColor, opts?: {
        centerXy?: [boolean, boolean];
        scaleXy?: BpxVector2d;
    }): void;
    /**
     * Takes a snapshot of the canvas, so it can be later used together with {@link BpxCanvasSnapshotColorMapping}.
     * Can be used e.g. for drawing a lighter pixels around light sources.
     *
     * @see https://github.com/beetrootpaul/beetpx-examples/tree/main/canvas-snapshot
     *
     * @example
     * ```ts
     * $d.takeCanvasSnapshot();
     * $d.ellipseFilled(lightXy.sub(lightRadius), $v(lightRadius * 2), BpxCanvasSnapshotColorMapping.of(
     *   (color: BpxRgbColor | null): BpxRgbColor | null =>
     *     color
     *       ? $rgb((50 + color.r) * 1.25, (30 + color.g) * 1.2, (10 + color.b) * 1.05)
     *       : null
     * ));
     * ```
     *
     * @category General
     */
    static takeCanvasSnapshot(): void;
}
/**
 * A shorthand for {@link BeetPxDraw}.
 *
 * @category API entry points
 */
declare const $d: typeof BeetPxDraw;

/**
 * One of 3 main API entry points. This one provides you with the useful
 * utils.
 *
 * @example
 * ```ts
 * BeetPxUtils.clamp($v_0_0, this.playerXy, BeetPx.canvasSize);
 * ```
 *
 * @category API entry points
 */
declare class BeetPxUtils {
    private constructor();
    /**
     * This function is meant to be used in a last branch of `if - else if - … - else`
     * chain or in `default` of `switch - case - case - …`. Let's imagine there is
     * a union type of which we check all possible cases. Someday we add one more
     * type to the union, but we forget to extend our `switch` by that one more `case`.
     * Thanks to `assertUnreachable(theValueOfThatUnionType)` the TypeScript checker
     * will inform us about such mistake.
     *
     * @param thingThatShouldBeOfTypeNeverAtThisPoint - a value which we expect to be of type `never`
     */
    static assertUnreachable(thingThatShouldBeOfTypeNeverAtThisPoint: never): void;
    /**
     * @param n How often to change the returned value
     * @param opts.onGamePause By default the method doesn't progress during the game pause.
     *                         But with this param set to `"ignore"` we can change that behaviour.
     *
     * @returns Either `true` or `false`, which changes every `n` frames
     */
    static booleanChangingEveryNthFrame(n: number, opts?: {
        onGamePause?: "pause" | "ignore";
    }): boolean;
    /**
     * Returns the middle number out of given three numbers. Useful for keeping a given
     * property within specified bounds.
     *
     * @example
     * ```ts
     * clamp(minSpeed, currentSpeed, maxSpeed);
     * ```
     */
    static clamp(a: number, b: number, c: number): number;
    /**
     * Similar to {@link BeetPxDraw.text}, but with a second color specified, to be used as an outline.
     */
    static drawTextWithOutline(text: string, canvasXy1: BpxVector2d, textColor: BpxRgbColor, outlineColor: BpxRgbColor, opts?: {
        centerXy?: [boolean, boolean];
        scaleXy?: BpxVector2d;
    }): void;
    /**
     * A simple helper which returns what it takes, without any changes.
     *
     * @example
     * ```ts
     * const doTheFancyTransformation = (x: value) => ...;
     * const fn = makeItFancy ? doTheFancyTransformation : BeetPxUtils.identity;
     * const newX = fn(x);
     * ```
     */
    static identity<Param>(param: Param): Param;
    /**
     * Picks a number between `a` and `b` which is in a "distance" between them as specified by `t`.
     * Specifically: `lerp(a,b,0) === a` and `lerp(a,b,1) === b`.
     *
     * With `opts: { clamp: true }`, the resulting value cannot is always within bounds of `a` and `b`, even if `t` is below `0` or above `1`.
     */
    static lerp(a: number, b: number, t: number, opts?: {
        clamp?: boolean;
    }): number;
    /**
     * A modulo operation – in contrary to native JavaScript's `%`, this one returns results from `[0, n)` range (positive values only).
     *
     * @example
     * ```ts
     * if ($x.wasButtonJustPressed("up")) {
     *   selected = BeetPxUtils.mod(selected - 1);
     * }
     * const menuItem = menuItems[selected];
     * ```
     */
    static mod(value: number, modulus: number): number;
    /**
     * A simple helper which does nothing.
     *
     * @example
     * ```ts
     * const doTheFancyThing = () => ...;
     * const fn = makeItFancy ? doTheFancyThing : BeetPxUtils.noop;
     * fn();
     * ```
     */
    static noop(): void;
    /**
     * Generates a list of XY to add to a given coordinate in order to get all adjacent pixels in 4 directions
     * (left/up/right/down).
     */
    static adjacent4(): [BpxVector2d, BpxVector2d, BpxVector2d, BpxVector2d];
    /**
     * Generates a list of XY to add to a given coordinate in order to get all adjacent pixels in 8 directions.
     */
    static adjacent8(): [
        BpxVector2d,
        BpxVector2d,
        BpxVector2d,
        BpxVector2d,
        BpxVector2d,
        BpxVector2d,
        BpxVector2d,
        BpxVector2d
    ];
    /**
     * Picks a random element from a given array.
     */
    static randomElementOf<TElement>(array: TElement[]): TElement | undefined;
    /**
     * Generates an array from `0` to `n-1`. Useful when we want to do a thing N times.
     *
     * @example
     * ```ts
     * BeetPxUtils.range(10).forEach(i => {
     *   BeetPxDraw.rect($v(1, 1 + i * 8), $v(40, 7), $rgb_red);
     * });
     * ```
     */
    static range(n: number): number[];
    /**
     * Takes an array an returns a new one, in which each element is repeated given amount of times.
     *
     * @example
     * ```ts
     * BeetPxUtils.repeatEachElement(3, ["a", "b"]);
     * // The above produces `["a", "a", "a", "b", "b", "b"]`.
     * ```
     */
    static repeatEachElement<TElement>(times: number, array: TElement[]): TElement[];
    /**
     * To be used as a value, e.g. in `definedValue: maybeUndefined() ?? throwError("…")`.
     *
     * @example
     * ```ts
     * function getValue(): number | null {
     *   // ...
     * }
     * const value = getValue() ?? throwError("Failed to get the value");
     * ```
     */
    static throwError(message: string): never;
    /**
     * @returns Turn angle. A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    static trigAtan2(x: number, y: number): number;
    /**
     * @param turnAngle A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    static trigCos(turnAngle: number): number;
    /**
     * @param turnAngle A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    static trigSin(turnAngle: number): number;
}
/**
 * A shorthand for {@link BeetPxUtils}.
 *
 * @category API entry points
 */
declare const $u: typeof BeetPxUtils;

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
declare function $aspr(imageUrl: BpxImageUrl): BpxImageBoundAnimatedSpriteFactory;
/**
 * A shorthand for {@link BpxFont.of}.
 *
 * @category Fonts
 */
declare function $font(config: Partial<BpxFontConfig>): BpxFont;
/**
 * A shorthand for {@link BpxFont.basedOn}.
 *
 * @category Fonts
 */
declare function $font(baseFont: BpxFont, extendedConfig: (baseFontConfig: BpxFontConfig) => BpxFontConfig): BpxFont;
/**
 * A built-in font based on {@link BpxFontConfigPico8}
 *
 * @category Fonts
 */
declare const $font_pico8: BpxFont;
/**
 * A built-in font based on {@link BpxFontConfigSaint11Minimal4}
 *
 * @category Fonts
 */
declare const $font_saint11Minimal4: BpxFont;
/**
 * A built-in font based on {@link BpxFontConfigSaint11Minimal5}
 *
 * @category Fonts
 */
declare const $font_saint11Minimal5: BpxFont;
/**
 * A shorthand for {@link BpxRgbColor.of}.
 *
 * @category Colors
 */
declare function $rgb(r: number, g: number, b: number): BpxRgbColor;
/**
 * A shorthand for {@link BpxRgbColor.fromCssHex}.
 *
 * @category Colors
 */
declare function $rgb(cssHex: string): BpxRgbColor;
/**
 * A shorthand for `$rgb("#000000")`.
 *
 * @category Colors
 */
declare const $rgb_black: BpxRgbColor;
/**
 * A shorthand for `$rgb("#ffffff")`.
 *
 * @category Colors
 */
declare const $rgb_white: BpxRgbColor;
/**
 * A shorthand for `$rgb("#ff0000")`.
 *
 * @category Colors
 */
declare const $rgb_red: BpxRgbColor;
/**
 * A shorthand for `$rgb("#00ff00")`.
 *
 * @category Colors
 */
declare const $rgb_green: BpxRgbColor;
/**
 * A shorthand for `$rgb("#0000ff")`.
 *
 * @category Colors
 */
declare const $rgb_blue: BpxRgbColor;
/**
 * A shorthand for `$rgb("#00ffff")`.
 *
 * @category Colors
 */
declare const $rgb_cyan: BpxRgbColor;
/**
 * A shorthand for `$rgb("#ff00ff")`.
 *
 * @category Colors
 */
declare const $rgb_magenta: BpxRgbColor;
/**
 * A shorthand for `$rgb("#ffff00")`.
 *
 * @category Colors
 */
declare const $rgb_yellow: BpxRgbColor;
/**
 * A shorthand for {@link BpxPalettePico8}
 *
 * @category Colors
 */
declare const $rgb_p8: typeof BpxPalettePico8;
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
declare function $spr(imageUrl: BpxImageUrl): BpxImageBoundSpriteFactory;
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
declare function $timer(frames: number, opts?: {
    loop?: boolean;
    paused?: boolean;
    delayFrames?: number;
    onGamePause?: "pause" | "ignore";
}): BpxTimer;
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
declare function $timerSeq<TPhaseName extends string>(params: {
    intro?: Array<[phase: TPhaseName, frames: number]>;
    loop?: Array<[phase: TPhaseName, frames: number]>;
}, opts?: {
    paused?: boolean;
    delayFrames?: number;
    onGamePause?: "pause" | "ignore";
}): BpxTimerSequence<TPhaseName>;
/**
 * A shorthand for {@link BpxVector2d.of}.
 *
 * @example
 * ```ts
 * $v(16); // same as `$v(16, 16)`
 * ```
 *
 * @category Core
 */
declare function $v(value: number): BpxVector2d;
/**
 * A shorthand for {@link BpxVector2d.of}.
 *
 * @example
 * ```ts
 * $v(16, 32);
 * ```
 *
 * @category Core
 */
declare function $v(x: number, y: number): BpxVector2d;
/**
 * A shorthand for `$v(0, 0)`.
 *
 * @category Core
 */
declare const $v_0_0: BpxVector2d;
/**
 * A shorthand for `$v(0, 1)`.
 *
 * @category Core
 */
declare const $v_0_1: BpxVector2d;
/**
 * A shorthand for `$v(1, 0)`.
 *
 * @category Core
 */
declare const $v_1_0: BpxVector2d;
/**
 * A shorthand for `$v(1, 1)`.
 *
 * @category Core
 */
declare const $v_1_1: BpxVector2d;

/**
 * @module API
 */
declare global {
    interface Window {
        BEETPX__IS_PROD: boolean;
        BEETPX__VERSION: string;
    }
    /**
     * A constant injected into global namespace during the build process.
     * Indicates whether the build is meant to be used for production
     * deployment (when run with `beetpx build`) or for development purposes
     * (when run with `beetpx dev`).
     *
     * @example
     * ```ts
     * $x.start({
     *   // ...,
     *   requireConfirmationOnTabClose: BEETPX__IS_PROD,
     *   debugMode: {
     *     available: !BEETPX__IS_PROD,
     *   },
     *   frameByFrame: {
     *     available: !BEETPX__VERSION,
     *   },
     * });
     * ```
     *
     * @notExported
     * @category Globals
     */
    const BEETPX__IS_PROD: boolean;
    /**
     * A constant injected into global namespace during the build process.
     * Holds a version string of a BeetPx the game was built with.
     *
     * @example
     * ```ts
     * $x.logDebug(`BeetPx version: ${BEETPX__VERSION}`);
     * ```
     *
     * @notExported
     * @category Globals
     */
    const BEETPX__VERSION: string;
}

export { $aspr, $d, $font, $font_pico8, $font_saint11Minimal4, $font_saint11Minimal5, $rgb, $rgb_black, $rgb_blue, $rgb_cyan, $rgb_green, $rgb_magenta, $rgb_p8, $rgb_red, $rgb_white, $rgb_yellow, $spr, $timer, $timerSeq, $u, $v, $v_0_0, $v_0_1, $v_1_0, $v_1_1, $x, BeetPx, BeetPxDraw, BeetPxUtils, BpxAnimatedSprite, type BpxArrangedGlyph, type BpxAssetsToLoad, type BpxAudioPlaybackId, type BpxBrowserType, type BpxCanvasSnapshot, BpxCanvasSnapshotColorMapping, type BpxColorMapper, BpxDrawingPattern, BpxEasing, type BpxEasingFn, type BpxEngineConfig, BpxFont, type BpxFontConfig, BpxFontConfigPico8, BpxFontConfigSaint11Minimal4, BpxFontConfigSaint11Minimal5, type BpxFpsDisplayPlacement, type BpxGameButtonName, type BpxGameInputEvent, type BpxGameInputMethod, type BpxGamepadType, BpxGamepadTypeDetector, type BpxGlyph, type BpxImageAsset, type BpxImageBoundAnimatedSpriteFactory, type BpxImageBoundSpriteFactory, type BpxImageUrl, type BpxJsonAsset, type BpxJsonUrl, type BpxKerningPrevSegmentMap, BpxPalettePico8, BpxPatternColors, type BpxPersistedStateValueConstraints, BpxPixels, type BpxPrintDebug, BpxRgbColor, type BpxRgbCssHex, type BpxSoundAsset, type BpxSoundSequence, type BpxSoundSequenceEntry, type BpxSoundSequenceEntrySoundAdditional, type BpxSoundSequenceEntrySoundMain, type BpxSoundUrl, BpxSprite, BpxSpriteColorMapping, type BpxTextColorMarkers, type BpxTextMeasurement, BpxTimer, BpxTimerSequence, BpxVector2d };
