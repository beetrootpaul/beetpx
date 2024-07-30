import { PngDataArray } from 'fast-png';

type BpxImageUrl = string;
type BpxSoundUrl = string;
type BpxJsonUrl = string;
type BpxImageAsset = {
    width: number;
    height: number;
    channels: 3 | 4;
    rgba8bitData: PngDataArray;
};
type BpxSoundAsset = {
    audioBuffer: AudioBuffer;
};
type BpxJsonAsset = {
    json: any;
};

type BpxAudioPlaybackId = number;

type BpxSoundSequence = {
    intro?: BpxSoundSequenceEntry[];
    loop?: BpxSoundSequenceEntry[];
};
type BpxSoundSequenceEntry = [
    SoundSequenceEntrySoundMain,
    ...SoundSequenceEntrySoundAdditional[]
];
type SoundSequenceEntrySoundMain = BpxSoundUrl | {
    url: BpxSoundUrl;
    durationMs?: (fullSoundDurationMs: number) => number;
};
type SoundSequenceEntrySoundAdditional = BpxSoundUrl | {
    url: BpxSoundUrl;
};

type BpxBrowserType = "chromium" | "firefox_windows" | "firefox_other" | "safari" | "other";

type BpxRgbCssHex = string;
declare class BpxRgbColor {
    static of(r: number, g: number, b: number): BpxRgbColor;
    static fromCssHex(cssHex: string): BpxRgbColor;
    readonly type = "rgb";
    readonly r: number;
    readonly g: number;
    readonly b: number;
    readonly cssHex: BpxRgbCssHex;
    private constructor();
    isSameAs(another: BpxRgbColor): boolean;
    asArray(): [r: number, g: number, b: number];
}

type BpxColorMapper = (sourceColor: BpxRgbColor | null, x: number, y: number) => BpxRgbColor | null;

type AssetsToLoad = Array<BpxImageUrl | BpxSoundUrl | BpxJsonUrl>;

interface PrintDebug {
    __printDebug(): string;
}

declare class BpxVector2d implements PrintDebug {
    readonly x: number;
    readonly y: number;
    /**
     * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    static unitFromAngle(turnAngle: number): BpxVector2d;
    static of(value: number): BpxVector2d;
    static of(x: number, y: number): BpxVector2d;
    private constructor();
    static min(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d;
    static max(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d;
    static minMax(xy1: BpxVector2d, xy2: BpxVector2d): [BpxVector2d, BpxVector2d];
    static lerp(xy1: BpxVector2d, xy2: BpxVector2d, t: number, opts?: {
        clamp?: boolean;
    }): BpxVector2d;
    asArray(): [number, number];
    magnitude(): number;
    normalize(): BpxVector2d;
    sign(): BpxVector2d;
    abs(): BpxVector2d;
    floor(): BpxVector2d;
    ceil(): BpxVector2d;
    round(): BpxVector2d;
    /**
     * "turn" – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    toAngle(): number;
    /** equal to */
    eq(other: BpxVector2d): boolean;
    eq(value: number): boolean;
    /** greater than */
    gt(other: BpxVector2d): boolean;
    gt(value: number): boolean;
    /** greater than or equal */
    gte(other: BpxVector2d): boolean;
    gte(value: number): boolean;
    /** less than */
    lt(other: BpxVector2d): boolean;
    lt(value: number): boolean;
    /** less than or equal */
    lte(other: BpxVector2d): boolean;
    lte(value: number): boolean;
    clamp(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d;
    /**
     * a modulo operation – in contrary to native `%`, this returns results from [0, n) range (positive values only)
     */
    mod(other: BpxVector2d): BpxVector2d;
    mod(value: number): BpxVector2d;
    mod(x: number, y: number): BpxVector2d;
    add(other: BpxVector2d): BpxVector2d;
    add(value: number): BpxVector2d;
    add(x: number, y: number): BpxVector2d;
    sub(other: BpxVector2d): BpxVector2d;
    sub(value: number): BpxVector2d;
    sub(x: number, y: number): BpxVector2d;
    mul(other: BpxVector2d): BpxVector2d;
    mul(value: number): BpxVector2d;
    mul(x: number, y: number): BpxVector2d;
    div(other: BpxVector2d): BpxVector2d;
    div(value: number): BpxVector2d;
    div(x: number, y: number): BpxVector2d;
    [Symbol.iterator](): Generator<number>;
    [Symbol.toPrimitive](hint: "default" | "string" | "number"): string | number;
    get [Symbol.toStringTag](): string;
    __printDebug(): string;
}

interface CanvasSnapshot {
    getColorAt(x: number, y: number): BpxRgbColor;
}

declare class BpxCanvasSnapshotColorMapping {
    #private;
    static of(mapping: BpxColorMapper): BpxCanvasSnapshotColorMapping;
    readonly type = "canvas_snapshot_mapping";
    private constructor();
    getMappedColor(snapshot: CanvasSnapshot | null, canvasX: number, canvasY: number): BpxRgbColor | null;
}

declare class BpxPatternColors {
    readonly primary: BpxRgbColor | null;
    readonly secondary: BpxRgbColor | null;
    static of(primary: BpxRgbColor | null, secondary: BpxRgbColor | null): BpxPatternColors;
    readonly type = "pattern";
    private constructor();
}

declare class BpxSpriteColorMapping {
    #private;
    static noMapping: BpxSpriteColorMapping;
    static from(colorMappingEntries: Array<[BpxRgbColor, BpxRgbColor | null]>): BpxSpriteColorMapping;
    static of(mapping: BpxColorMapper): BpxSpriteColorMapping;
    readonly type = "sprite_mapping";
    private constructor();
    getMappedColor(spriteColor: BpxRgbColor | null, spriteX: number, spriteY: number): BpxRgbColor | null;
}

declare class BpxPixels {
    static from(ascii: string): BpxPixels;
    readonly asciiRows: string[];
    readonly size: BpxVector2d;
    private constructor();
}

type BpxImageBoundSpriteFactory = (w: number, h: number, x: number, y: number) => BpxSprite;
declare class BpxSprite {
    static from(imageUrl: BpxImageUrl, w: number, h: number, x: number, y: number): BpxSprite;
    readonly type = "static";
    readonly imageUrl: BpxImageUrl;
    readonly size: BpxVector2d;
    readonly xy: BpxVector2d;
    private constructor();
    clipBy(xy1: BpxVector2d, xy2: BpxVector2d): BpxSprite;
}

type BpxKerningPrevCharMap = {
    [prevChar: string]: number;
};
type BpxTextColorMarkers = {
    [marker: string]: BpxRgbColor;
};
type BpxGlyph = {
    type: "sprite";
    sprite: BpxSprite;
    /** This function is used to distinguish text from its background on a font's sprite sheet. */
    isTextColor: (color: BpxRgbColor | null) => boolean;
    advance: number;
    offset?: BpxVector2d;
    kerning?: BpxKerningPrevCharMap;
} | {
    type: "pixels";
    pixels: BpxPixels;
    advance: number;
    offset?: BpxVector2d;
    kerning?: BpxKerningPrevCharMap;
} | {
    type: "whitespace";
    advance: number;
    kerning?: BpxKerningPrevCharMap;
};
type BpxArrangedGlyph = {
    type: "sprite";
    char: string;
    /** Left-top position of a glyph in relation to the left-top of the entire text. */
    leftTop: BpxVector2d;
    lineNumber: number;
    sprite: BpxSprite;
    spriteColorMapping: BpxSpriteColorMapping;
} | {
    type: "pixels";
    char: string;
    /** Left-top position of a glyph in relation to the left-top of the entire text. */
    leftTop: BpxVector2d;
    lineNumber: number;
    pixels: BpxPixels;
    color: BpxRgbColor;
} | {
    type: "line_break";
    lineNumber: number;
};
type BpxFontConfig = {
    /** An amount of pixels from the baseline (included) to the top-most pixel of font's glyphs. */
    ascent: number;
    /** An amount of pixels from the baseline (excluded) to the bottom-most pixel of font's glyphs. */
    descent: number;
    /** An amount of pixels between the bottom-most pixel of the previous line (excluded) and
     *  the top-most pixel of the next line (excluded). */
    lineGap: number;
    /** This functions maps the text grapheme (a user-perceived character like `a` or a
     *  multi-character emoji like `❤️`) before trying to find its corresponding glyph
     *  in a `glyphs` map. It would be typically used to call `grapheme.toLowerCase()`
     *  in fonts which have glyphs defined for lower-case characters only. */
    mapGrapheme: (grapheme: string) => string;
    /** A map which contains the glyphs for specified graphemes (keys of the map).
     *  Grapheme is a user-perceived character like `a` or a multi-character emoji
     *  like `❤️`. Before retrieving a glyph from this map, a grapheme is normalized
     *  with use of `mapGrapheme` function. Typically, it would be useful when you
     *  want to specify same glyphs for both upper-case and lower-case characters,
     *  so you are able to define lower-case ones only and then implement
     *  `mapGrapheme` as `grapheme.toLowerCase()`. */
    glyphs: Map<string, BpxGlyph>;
};
declare class BpxFont {
    #private;
    static of(config: Partial<BpxFontConfig>): BpxFont;
    static basedOn(baseFont: BpxFont, extendedConfig: (baseFontConfig: BpxFontConfig) => BpxFontConfig): BpxFont;
    constructor(config: BpxFontConfig);
    get spriteSheetUrls(): string[];
    get ascent(): number;
    get descent(): number;
    get lineGap(): number;
    arrangeGlyphsFor(text: string, textColor: BpxRgbColor, colorMarkers?: BpxTextColorMarkers): BpxArrangedGlyph[];
}

type BpxImageBoundAnimatedSpriteFactory = (w: number, h: number, xys: [x: number, y: number][], opts?: {
    pause?: boolean;
    onGamePause?: "pause" | "ignore";
}) => BpxAnimatedSprite;
declare class BpxAnimatedSprite {
    #private;
    static from(imageUrl: BpxImageUrl, w: number, h: number, xys: [x: number, y: number][], opts?: {
        pause?: boolean;
        onGamePause?: "pause" | "ignore";
    }): BpxAnimatedSprite;
    readonly type = "animated";
    readonly imageUrl: BpxImageUrl;
    readonly size: BpxVector2d;
    private constructor();
    get current(): BpxSprite;
    pause(): void;
    resume(): void;
    restart(): void;
}

declare class BpxDrawingPattern {
    #private;
    /**
     * Creates a BpxDrawingPattern from a visual representation of 4 columns and 4 rows
     *   (designated by new lines) where `#` and `-` stand for a primary and
     *   a secondary color. Whitespaces are ignored.
     */
    static from(ascii: string): BpxDrawingPattern;
    static of(bits: number): BpxDrawingPattern;
    static primaryOnly: BpxDrawingPattern;
    static secondaryOnly: BpxDrawingPattern;
    private constructor();
    hasPrimaryColorAt(x: number, y: number): boolean;
}

type BpxTextMeasurement = {
    wh: BpxVector2d;
    offset: BpxVector2d;
};

type FpsDisplayPlacement = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type BpxGameButtonName = "left" | "right" | "up" | "down" | "a" | "b" | "menu";

declare const supportedGamepadTypes: readonly ["xbox", "dualsense", "8bitdo", "other"];
type BpxGamepadType = (typeof supportedGamepadTypes)[number];

type GameInputMethod = "gamepad" | "keyboard" | "mouse" | "touch";
type BpxGameInputEvent = null | "button_left" | "button_right" | "button_up" | "button_down" | "button_a" | "button_b" | "button_menu" | "mute_unmute_toggle" | "full_screen" | "debug_toggle" | "frame_by_frame_toggle" | "frame_by_frame_step";

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

type BpxPersistedStateValueConstraints = Record<string, string | number | boolean | null>;

type BpxEngineConfig = {
    canvasSize?: "64x64" | "128x128" | "256x256";
    fixedTimestep?: "30fps" | "60fps";
    assets?: AssetsToLoad;
    globalPause?: {
        available?: boolean;
    };
    requireConfirmationOnTabClose?: boolean;
    debugMode?: {
        /** A recommended approach would be to set it to `!window.BEETPX__IS_PROD`. */
        available?: boolean;
        /** If `true`, then the debug mode will be enabled on start no matter what its persisted state was. */
        forceEnabledOnStart?: boolean;
        fpsDisplay?: {
            enabled?: boolean;
            color?: BpxRgbColor;
            placement?: FpsDisplayPlacement;
        };
    };
    frameByFrame?: {
        /** A recommended approach would be to set it to `!window.BEETPX__IS_PROD`. */
        available?: boolean;
        /** If `true`, then the frame-by-frame mode will be activated from the very start. */
        activateOnStart?: boolean;
    };
};

type BpxEasingFn = (t: number) => number;
declare class BpxEasing {
    static linear: BpxEasingFn;
    static inQuadratic: BpxEasingFn;
    static outQuadratic: BpxEasingFn;
    static inQuartic: BpxEasingFn;
    static outQuartic: BpxEasingFn;
}

/**
 * A free to use (CC-0) color palette created by zep and distributed as part of PICO-8 fantasy console.
 *
 * Links:
 *  - https://www.lexaloffle.com/pico-8.php?page=faq – an info about the palette being available under a CC-0 license
 *  - https://pico-8.fandom.com/wiki/Palette#The_system_palette – hex values are copy-pasted from here
 */
declare class BpxPalettePico8 {
    static black: BpxRgbColor;
    static storm: BpxRgbColor;
    static wine: BpxRgbColor;
    static moss: BpxRgbColor;
    static tan: BpxRgbColor;
    static slate: BpxRgbColor;
    static silver: BpxRgbColor;
    static white: BpxRgbColor;
    static ember: BpxRgbColor;
    static orange: BpxRgbColor;
    static lemon: BpxRgbColor;
    static lime: BpxRgbColor;
    static sky: BpxRgbColor;
    static dusk: BpxRgbColor;
    static pink: BpxRgbColor;
    static peach: BpxRgbColor;
}

/**
 * A free to use (CC-0) font created by zep and distributed as part of PICO-8 fantasy console.
 *
 * Links:
 *  - https://www.lexaloffle.com/pico-8.php?page=faq – an info about the font being available under a CC-0 license
 */
declare class BpxFontConfigPico8 implements BpxFontConfig {
    #private;
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
 *   . : ! ? ' " * / + -
 *   0 1 2 3 4 5 6 7 8 9
 *   % $ ( ) [ ] { } < >
 *   A B C D E F G H I J K L M
 *   N O P Q R S T U V W X Y Z
 *   a b c d e f g h i j k l m      (note: both upper- and lower-case
 *   n o p q r s t u v w x y z             characters use same glyphs)
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
 *   . : ! ? ' " * / + -
 *   0 1 2 3 4 5 6 7 8 9
 *   % $ ( ) [ ] { } < >
 *   A B C D E F G H I J K L M
 *   N O P Q R S T U V W X Y Z
 *   a b c d e f g h i j k l m
 *   n o p q r s t u v w x y z
 */
declare class BpxFontConfigSaint11Minimal5 implements BpxFontConfig {
    #private;
    ascent: number;
    descent: number;
    lineGap: number;
    mapGrapheme(grapheme: string): string;
    glyphs: Map<string, BpxGlyph>;
}

declare class BpxGamepadTypeDetector {
    static detect(gamepad: Gamepad): BpxGamepadType;
}

declare class BpxTimer {
    #private;
    static for(opts: {
        frames: number;
        loop: boolean;
        pause: boolean;
        delayFrames: number;
        onGamePause: "pause" | "ignore";
    }): BpxTimer;
    private constructor();
    get t(): number;
    get framesLeft(): number;
    get progress(): number;
    get hasFinished(): boolean;
    get hasJustFinished(): boolean;
    pause(): void;
    resume(): void;
    restart(): void;
}

declare class BpxTimerSequence<TPhaseName extends string> {
    #private;
    static of<TPhaseName extends string>(params: {
        intro: Array<[phase: TPhaseName, frames: number]>;
        loop: Array<[phase: TPhaseName, frames: number]>;
    }, opts: {
        pause: boolean;
        delayFrames: number;
        onGamePause: "pause" | "ignore";
    }): BpxTimerSequence<TPhaseName>;
    private constructor();
    get justFinishedPhase(): TPhaseName | null;
    get currentPhase(): TPhaseName | null;
    get t(): number;
    get progress(): number;
    get framesLeft(): number;
    get tOverall(): number;
    get framesLeftOverall(): number;
    get progressOverall(): number;
    get hasFinishedOverall(): boolean;
    get hasJustFinishedOverall(): boolean;
    pause(): void;
    resume(): void;
    restart(): void;
}

declare class BeetPxUtils {
    private constructor();
    /**
     * This function is meant to be used in a last branch of `if - else if - … - else`
     *   chain or in `default` of `switch - case - case - …`. Let's imagine there is
     *   a union type of which we check all possible cases. Someday we add one more
     *   type to the union, but we forget to extend our `switch` by that one more `case`.
     *   Thanks to `assertUnreachable(theValueOfThatUnionType)` the TypeScript checker
     *   will inform us about such mistake.
     *
     * @param thingThatShouldBeOfTypeNeverAtThisPoint - a value which we expect to be of type never
     */
    static assertUnreachable(thingThatShouldBeOfTypeNeverAtThisPoint: never): void;
    static booleanChangingEveryNthFrame(n: number, opts?: {
        onGamePause?: "pause" | "ignore";
    }): boolean;
    /**
     * Returns the middle number. Example usage: `clamp(min, value, max)`
     *   in order to find a value which is:
     *   - `value` if it is `>= min` and `<= max`
     *   - `min` if `value` is `< min`
     *   - `max` if `value` is `> max`
     */
    static clamp(a: number, b: number, c: number): number;
    static drawTextWithOutline(text: string, canvasXy1: BpxVector2d, textColor: BpxRgbColor, outlineColor: BpxRgbColor, opts?: {
        centerXy?: [boolean, boolean];
        scaleXy?: BpxVector2d;
    }): void;
    static identity<Param>(param: Param): Param;
    static lerp(a: number, b: number, t: number, opts?: {
        clamp?: boolean;
    }): number;
    /**
     * a modulo operation – in contrary to native `%`, this returns results from [0, n) range (positive values only)
     */
    static mod(value: number, modulus: number): number;
    static noop(): void;
    /**
     * Generates a list of XY to add to a given coordinate in order to get all offsets by 1 pixel in 4 directions.
     */
    static offset4Directions(): [
        BpxVector2d,
        BpxVector2d,
        BpxVector2d,
        BpxVector2d
    ];
    /**
     * Generates a list of XY to add to a given coordinate in order to get all offsets by 1 pixel in 8 directions.
     */
    static offset8Directions(): [
        BpxVector2d,
        BpxVector2d,
        BpxVector2d,
        BpxVector2d,
        BpxVector2d,
        BpxVector2d,
        BpxVector2d,
        BpxVector2d
    ];
    static randomElementOf<TElement>(array: TElement[]): TElement | undefined;
    static range(n: number): number[];
    static repeatEachElement<TElement>(times: number, array: TElement[]): TElement[];
    /**
     * To be used as a value, e.g. in `definedValue: maybeUndefined() ?? throwError("…")`.
     */
    static throwError(message: string): never;
    /**
     * @return turn angle. A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    static trigAtan2(x: number, y: number): number;
    /**
     * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    static trigCos(turnAngle: number): number;
    /**
     * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    static trigSin(turnAngle: number): number;
}
declare class BeetPxDraw {
    #private;
    private constructor();
    static clearCanvas(color: BpxRgbColor): void;
    /**
     * @returns - previous clipping region in form of an array: [xy, wh]
     */
    static setClippingRegion(xy: BpxVector2d, wh: BpxVector2d): [xy: BpxVector2d, wh: BpxVector2d];
    /**
     * @returns - previous clipping region in form of an array: [xy, wh]
     */
    static removeClippingRegion(): [xy: BpxVector2d, wh: BpxVector2d];
    /**
     * Sets a new XY (left-top corner) of a camera's viewport
     *
     * @returns previous camera XY
     */
    static setCameraXy(xy: BpxVector2d): BpxVector2d;
    /**
     * @returns previous pattern
     */
    static setDrawingPattern(pattern: BpxDrawingPattern): BpxDrawingPattern;
    static pixel(xy: BpxVector2d, color: BpxRgbColor): void;
    /**
     * Draws pixels based on a visual 2d representation in form of rows
     *   (designated by new lines) where `#` and `-` stand for a colored
     *   pixel and a lack of a pixel. Whitespaces are ignored.
     */
    static pixels(pixels: BpxPixels, xy: BpxVector2d, color: BpxRgbColor, opts?: {
        centerXy?: [boolean, boolean];
        scaleXy?: BpxVector2d;
        flipXy?: [boolean, boolean];
    }): void;
    static line(xy: BpxVector2d, wh: BpxVector2d, color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping): void;
    static rect(xy: BpxVector2d, wh: BpxVector2d, color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping): void;
    static rectFilled(xy: BpxVector2d, wh: BpxVector2d, color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping): void;
    static rectOutsideFilled(xy: BpxVector2d, wh: BpxVector2d, color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping): void;
    static ellipse(xy: BpxVector2d, wh: BpxVector2d, color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping): void;
    static ellipseFilled(xy: BpxVector2d, wh: BpxVector2d, color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping): void;
    static ellipseOutsideFilled(xy: BpxVector2d, wh: BpxVector2d, color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping): void;
    /**
     * @returns previous sprite color mapping
     */
    static setSpriteColorMapping(spriteColorMapping: BpxSpriteColorMapping): BpxSpriteColorMapping;
    static sprite(sprite: BpxSprite | BpxAnimatedSprite, xy: BpxVector2d, opts?: {
        centerXy?: [boolean, boolean];
        scaleXy?: BpxVector2d;
        flipXy?: [boolean, boolean];
    }): void;
    /**
     * @returns - previously used font
     */
    static setFont(font: BpxFont): BpxFont;
    /**
     * @returns - previously used color markers
     */
    static setTextColorMarkers(textColorMarkers: BpxTextColorMarkers): BpxTextColorMarkers;
    static measureText(text: string, opts?: {
        centerXy?: [boolean, boolean];
        scaleXy?: BpxVector2d;
    }): BpxTextMeasurement;
    static text(text: string, xy: BpxVector2d, color: BpxRgbColor, opts?: {
        centerXy?: [boolean, boolean];
        scaleXy?: BpxVector2d;
    }): void;
    static takeCanvasSnapshot(): void;
}
declare class BeetPx {
    #private;
    private constructor();
    static start(config?: BpxEngineConfig): Promise<void>;
    static get debug(): boolean;
    static get canvasSize(): BpxVector2d;
    /**
     * Number of frames processed since game started.
     * It gets reset to 0 when `BeetPx.restart()` is called.
     * It counts update calls, not draw calls.
     *
     * @return number
     */
    static get frameNumber(): number;
    static get frameNumberOutsidePause(): number;
    static get renderingFps(): number;
    static get detectedBrowserType(): BpxBrowserType;
    static setOnStarted(onStarted?: () => void): void;
    static setOnUpdate(onUpdate?: () => void): void;
    static setOnDraw(onDraw?: () => void): void;
    static restart(): void;
    static logDebug(...args: unknown[]): void;
    static logInfo(...args: unknown[]): void;
    static logWarn(...args: unknown[]): void;
    static logError(...args: unknown[]): void;
    static get isPaused(): boolean;
    static get wasJustPaused(): boolean;
    static get wasJustResumed(): boolean;
    static pause(): void;
    static resume(): void;
    static wasAnyButtonJustPressed(): boolean;
    static wasButtonJustPressed(button: BpxGameButtonName): boolean;
    static wasButtonJustReleased(button: BpxGameButtonName): boolean;
    static isAnyButtonPressed(): boolean;
    static isButtonPressed(button: BpxGameButtonName): boolean;
    static getPressedDirection(): BpxVector2d;
    static setButtonRepeating(button: BpxGameButtonName, repeating: {
        firstRepeatFrames: number | null;
        loopedRepeatFrames: number | null;
    }): void;
    static getRecentInputMethods(): Set<GameInputMethod>;
    static getConnectedGamepadTypes(): Set<BpxGamepadType>;
    static getEventsCapturedInLastUpdate(): Set<BpxGameInputEvent>;
    static isAudioMuted(): boolean;
    static muteAudio(opts?: {
        fadeOutMillis?: number;
    }): void;
    static unmuteAudio(opts?: {
        fadeInMillis?: number;
    }): void;
    static startPlayback(soundUrl: BpxSoundUrl, opts?: {
        muteOnStart?: boolean;
        onGamePause?: "pause" | "mute" | "ignore";
    }): BpxAudioPlaybackId;
    static startPlaybackLooped(soundUrl: BpxSoundUrl, opts?: {
        muteOnStart?: boolean;
        onGamePause?: "pause" | "mute" | "ignore";
    }): BpxAudioPlaybackId;
    static startPlaybackSequence(soundSequence: BpxSoundSequence, opts?: {
        muteOnStart?: boolean;
        onGamePause?: "pause" | "mute" | "ignore";
    }): BpxAudioPlaybackId;
    static mutePlayback(playbackId: BpxAudioPlaybackId, opts?: {
        fadeOutMillis?: number;
    }): void;
    static unmutePlayback(playbackId: BpxAudioPlaybackId, opts?: {
        fadeInMillis?: number;
    }): void;
    static stopPlayback(playbackId: BpxAudioPlaybackId, opts?: {
        fadeOutMillis?: number;
    }): void;
    static pausePlayback(playbackId: BpxAudioPlaybackId): void;
    static resumePlayback(playbackId: BpxAudioPlaybackId): void;
    static getAudioContext(): AudioContext;
    static isFullScreenSupported(): boolean;
    static isInFullScreen(): boolean;
    static toggleFullScreen(): void;
    static savePersistedState<PersistedStateValue extends BpxPersistedStateValueConstraints>(value: PersistedStateValue): void;
    static loadPersistedState<PersistedStateValue extends BpxPersistedStateValueConstraints>(): PersistedStateValue | null;
    static clearPersistedState(): void;
    static getImageAsset(imageUrl: BpxImageUrl): BpxImageAsset;
    static getSoundAsset(soundUrl: BpxSoundUrl): BpxSoundAsset;
    static getJsonAsset(jsonUrl: BpxJsonUrl): BpxJsonAsset;
}
declare const $: typeof BeetPx;
declare const $d: typeof BeetPxDraw;
declare const $u: typeof BeetPxUtils;

declare function $aspr(imageUrl: BpxImageUrl): BpxImageBoundAnimatedSpriteFactory;
declare function $font(config: Partial<BpxFontConfig>): BpxFont;
declare function $font(baseFont: BpxFont, extendedConfig: (baseFontConfig: BpxFontConfig) => BpxFontConfig): BpxFont;
declare const $font_pico8: BpxFont;
declare const $font_saint11Minimal4: BpxFont;
declare const $font_saint11Minimal5: BpxFont;
declare function $rgb(r: number, g: number, b: number): BpxRgbColor;
declare function $rgb(cssHex: string): BpxRgbColor;
declare const $rgb_black: BpxRgbColor;
declare const $rgb_white: BpxRgbColor;
declare const $rgb_red: BpxRgbColor;
declare const $rgb_green: BpxRgbColor;
declare const $rgb_blue: BpxRgbColor;
declare const $rgb_cyan: BpxRgbColor;
declare const $rgb_magenta: BpxRgbColor;
declare const $rgb_yellow: BpxRgbColor;
declare const $rgb_p8: typeof BpxPalettePico8;
declare function $spr(imageUrl: BpxImageUrl): BpxImageBoundSpriteFactory;
declare function $timer(frames: number, opts?: {
    loop?: boolean;
    pause?: boolean;
    delayFrames?: number;
    onGamePause?: "pause" | "ignore";
}): BpxTimer;
declare function $timerSeq<TPhaseName extends string>(params: {
    intro?: Array<[phase: TPhaseName, frames: number]>;
    loop?: Array<[phase: TPhaseName, frames: number]>;
}, opts?: {
    pause?: boolean;
    delayFrames?: number;
    onGamePause?: "pause" | "ignore";
}): BpxTimerSequence<TPhaseName>;
declare function $v(value: number): BpxVector2d;
declare function $v(x: number, y: number): BpxVector2d;
declare const $v_0_0: BpxVector2d;
declare const $v_1_1: BpxVector2d;

declare global {
    /**
     * Note: the generated documentation marks this variable as "Not Exported".
     *   This is *not* true.
     *
     * @notExported
     */
    interface Window {
        BEETPX__IS_PROD: boolean;
        BEETPX__VERSION: string;
    }
    /**
     * Note: This constant is labelled as "Not Exported" in these docs. It is not true.
     *       We had to mark this constant with `@notExported` only to trick `typedoc`
     *       into including in these docs here.
     *
     * @notExported
     */
    const BEETPX__IS_PROD: boolean;
    /**
     * Note: This constant is labelled as "Not Exported" in these docs. It is not true.
     *       We had to mark this constant with `@notExported` only to trick `typedoc`
     *       into including in these docs here.
     *
     * @notExported
     */
    const BEETPX__VERSION: string;
}

export { $, $aspr, $d, $font, $font_pico8, $font_saint11Minimal4, $font_saint11Minimal5, $rgb, $rgb_black, $rgb_blue, $rgb_cyan, $rgb_green, $rgb_magenta, $rgb_p8, $rgb_red, $rgb_white, $rgb_yellow, $spr, $timer, $timerSeq, $u, $v, $v_0_0, $v_1_1, BeetPx, BeetPxDraw, BeetPxUtils, BpxAnimatedSprite, type BpxArrangedGlyph, type BpxAudioPlaybackId, type BpxBrowserType, BpxCanvasSnapshotColorMapping, type BpxColorMapper, BpxDrawingPattern, BpxEasing, type BpxEasingFn, type BpxEngineConfig, BpxFont, type BpxFontConfig, BpxFontConfigPico8, BpxFontConfigSaint11Minimal4, BpxFontConfigSaint11Minimal5, type BpxGameButtonName, type BpxGameInputEvent, type BpxGamepadType, BpxGamepadTypeDetector, type BpxGlyph, type BpxImageAsset, type BpxImageBoundAnimatedSpriteFactory, type BpxImageBoundSpriteFactory, type BpxImageUrl, type BpxJsonAsset, type BpxJsonUrl, type BpxKerningPrevCharMap, BpxPalettePico8, BpxPatternColors, BpxPixels, BpxRgbColor, type BpxRgbCssHex, type BpxSoundAsset, type BpxSoundSequence, type BpxSoundSequenceEntry, type BpxSoundUrl, BpxSprite, BpxSpriteColorMapping, type BpxTextColorMarkers, BpxTimer, BpxTimerSequence, BpxVector2d };
