import { PngDataArray } from 'fast-png';

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
    asArray(): [r: number, g: number, b: number];
}
declare function rgb_(r: number, g: number, b: number): BpxRgbColor;
declare const rgb_black_: BpxRgbColor;
declare const rgb_white_: BpxRgbColor;
declare const rgb_red_: BpxRgbColor;
declare const rgb_green_: BpxRgbColor;
declare const rgb_blue_: BpxRgbColor;
declare const rgb_cyan_: BpxRgbColor;
declare const rgb_magenta_: BpxRgbColor;
declare const rgb_yellow_: BpxRgbColor;

interface PrintDebug {
    __printDebug(): string;
}

declare function v_(value: number): BpxVector2d;
declare function v_(x: number, y: number): BpxVector2d;
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
declare const v_0_0_: BpxVector2d;
declare const v_1_1_: BpxVector2d;

declare class BpxUtils {
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
    static booleanChangingEveryNthFrame(n: number): boolean;
    static clamp(a: number, b: number, c: number): number;
    static identity<Param>(param: Param): Param;
    static isDefined<Value>(value: Value | null | undefined): value is Value;
    static lerp(a: number, b: number, t: number, opts?: {
        clamp?: boolean;
    }): number;
    /**
     * @returns {[BpxVector2d, BpxVector2d] } - XY and WH of the text,
     *          where XY represents an offset from the initial top-left
     *          corner where printing of the text would start. For example
     *          imagine a font in which there are some chars higher by 1px
     *          than standard height of other characters. In such case
     *          returned XY would be (0,-1).
     */
    static measureText(text: string): [xy: BpxVector2d, wh: BpxVector2d];
    /**
     * a modulo operation – in contrary to native `%`, this returns results from [0, n) range (positive values only)
     */
    static mod(value: number, modulus: number): number;
    static noop(): void;
    static offset4Directions(): BpxVector2d[];
    static offset8Directions(): BpxVector2d[];
    static drawTextWithOutline(text: string, canvasXy1: BpxVector2d, textColor: BpxRgbColor, outlineColor: BpxRgbColor, opts?: {
        centerXy?: [boolean, boolean];
        scaleXy?: BpxVector2d;
    }): void;
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
    static wait(millis: number): Promise<void>;
}
declare const u_: typeof BpxUtils;

declare class BpxPixels {
    static from(ascii: string): BpxPixels;
    readonly asciiRows: string[];
    readonly wh: BpxVector2d;
    private constructor();
}

type BpxCharSprite = {
    char: string;
    positionInText: BpxVector2d;
} & ({
    type: "image";
    spriteXyWh: [xy: BpxVector2d, wh: BpxVector2d];
} | {
    type: "pixels";
    pixels: BpxPixels;
});
type BpxFontId = string;
interface BpxFont {
    readonly id: BpxFontId;
    readonly imageUrl: BpxImageUrl | null;
    spritesFor(text: string): BpxCharSprite[];
}

type BpxImageUrl = string;
type BpxSoundUrl = string;
type BpxJsonUrl = string;
type BpxImageAsset = {
    width: number;
    height: number;
    channels: 3 | 4;
    rgba8bitData: PngDataArray;
};
type BpxFontAsset = {
    font: BpxFont;
    image: BpxImageAsset | null;
    spriteTextColor: BpxRgbColor | null;
};
type BpxSoundAsset = {
    audioBuffer: AudioBuffer;
};
type BpxJsonAsset = {
    json: any;
};
declare class Assets {
    #private;
    addImageAsset(imageUrl: BpxImageUrl, imageAsset: BpxImageAsset): void;
    addFontAsset(fontId: BpxFontId, fontProps: {
        font: BpxFont;
        spriteTextColor: BpxRgbColor | null;
    }): void;
    addSoundAsset(soundUrl: BpxSoundUrl, soundAsset: BpxSoundAsset): void;
    addJsonAsset(jsonUrl: BpxJsonUrl, jsonAsset: BpxJsonAsset): void;
    getImageAsset(imageUrl: BpxImageUrl): BpxImageAsset;
    getFontAsset(fontId: BpxFontId): BpxFontAsset;
    getSoundAsset(soundUrl: BpxSoundUrl): BpxSoundAsset;
    getJsonAsset(jsonUrl: BpxJsonUrl): BpxJsonAsset;
}

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

interface CanvasSnapshot {
    getColorAtIndex(index: number): BpxRgbColor;
}

type BpxColorMapper = (sourceColor: BpxRgbColor | null) => BpxRgbColor | null;

declare class BpxCanvasSnapshotColorMapping {
    #private;
    static of(mapping: BpxColorMapper): BpxCanvasSnapshotColorMapping;
    readonly type = "canvas_snapshot_mapping";
    private constructor();
    getMappedColor(snapshot: CanvasSnapshot | null, index: number): BpxRgbColor | null;
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
    getMappedColor(spriteColor: BpxRgbColor | null): BpxRgbColor | null;
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
declare class BpxFontSaint11Minimal4 implements BpxFont {
    #private;
    static id: BpxFontId;
    readonly id: BpxFontId;
    readonly imageUrl: BpxImageUrl | null;
    spritesFor(text: string): BpxCharSprite[];
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
declare class BpxFontSaint11Minimal5 implements BpxFont {
    #private;
    static id: BpxFontId;
    readonly id: BpxFontId;
    readonly imageUrl: BpxImageUrl | null;
    spritesFor(text: string): BpxCharSprite[];
}

declare class Button {
    #private;
    static get repeatingFramesStart(): number;
    static get repeatingFramesInterval(): number;
    static setRepeatingParamsFor(updateFps: 30 | 60): void;
    get isPressed(): boolean;
    wasJustPressed(repeating: boolean): boolean;
    wasJustReleased(repeating: boolean): boolean;
    update(isPressed: boolean): void;
}

type BpxGameButtonName = "left" | "right" | "up" | "down" | "a" | "b" | "menu";
declare class GameButtons {
    #private;
    update(events: Set<BpxGameInputEvent>): void;
    isAnyPressed(): boolean;
    isPressed(button: BpxGameButtonName): boolean;
    getPressedDirection(): BpxVector2d;
    setRepeating(button: BpxGameButtonName, repeating: boolean): void;
    wasAnyJustPressed(): boolean;
    wasJustPressed(button: BpxGameButtonName): boolean;
    wasJustReleased(button: BpxGameButtonName): boolean;
}

interface GameInputSpecialized {
    inputMethod: GameInputMethod;
    startListening(): void;
    /**
     * @return Whether any events were added to eventsCollector
     */
    update(eventsCollector: Set<BpxGameInputEvent>): boolean;
}

declare const supportedGamepadTypes: readonly ["xbox", "dualsense", "8bitdo", "other"];
type BpxGamepadType = (typeof supportedGamepadTypes)[number];
declare class GameInputGamepad implements GameInputSpecialized {
    #private;
    inputMethod: GameInputMethod;
    constructor(params: {
        browserType: BpxBrowserType;
    });
    startListening(): void;
    update(eventsCollector: Set<BpxGameInputEvent>): boolean;
    connectedGamepadTypes(): Set<BpxGamepadType>;
}

type GameInputMethod = "gamepad" | "keyboard" | "mouse" | "touch";
type BpxGameInputEvent = null | "button_left" | "button_right" | "button_up" | "button_down" | "button_a" | "button_b" | "button_menu" | "mute_unmute_toggle" | "full_screen" | "debug_toggle" | "frame_by_frame_toggle" | "frame_by_frame_step";
declare class GameInput {
    #private;
    readonly gameInputsSpecialized: GameInputSpecialized[];
    readonly gameInputGamepad: GameInputGamepad;
    readonly gameButtons: GameButtons;
    readonly buttonFullScreen: Button;
    readonly buttonMuteUnmute: Button;
    readonly buttonDebugToggle: Button;
    readonly buttonFrameByFrameToggle: Button;
    readonly buttonFrameByFrameStep: Button;
    constructor(params: {
        enableDebugInputs: boolean;
        browserType: BpxBrowserType;
    });
    startListening(): void;
    /**
     * @return If any interaction happened.
     */
    update(params: {
        skipGameButtons: boolean;
    }): boolean;
    getRecentInputMethods(): Set<GameInputMethod>;
    getConnectedGamepadTypes(): Set<BpxGamepadType>;
    getEventsCapturedInLastUpdate(): Set<BpxGameInputEvent>;
}

declare class BpxGamepadTypeDetector {
    static detect(gamepad: Gamepad): BpxGamepadType;
}

type BpxEasingFn = (t: number) => number;
declare class BpxEasing {
    static linear: BpxEasingFn;
    static inQuadratic: BpxEasingFn;
    static outQuadratic: BpxEasingFn;
    static inQuartic: BpxEasingFn;
    static outQuartic: BpxEasingFn;
}

type ImageBoundSpriteFactory = (w: number, h: number, x: number, y: number) => BpxSprite;
declare function spr_(imageUrl: BpxImageUrl): ImageBoundSpriteFactory;
declare class BpxSprite {
    static from(imageUrl: BpxImageUrl, w: number, h: number, x: number, y: number): BpxSprite;
    readonly type = "static";
    readonly imageUrl: BpxImageUrl;
    readonly size: BpxVector2d;
    readonly xy: BpxVector2d;
    private constructor();
    clipBy(xy1: BpxVector2d, xy2: BpxVector2d): BpxSprite;
}

type ImageBoundAnimatedSpriteFactory = (w: number, h: number, xys: [x: number, y: number][]) => BpxAnimatedSprite;
declare function aspr_(imageUrl: BpxImageUrl): ImageBoundAnimatedSpriteFactory;
declare class BpxAnimatedSprite {
    #private;
    static from(imageUrl: BpxImageUrl, w: number, h: number, xys: [x: number, y: number][]): BpxAnimatedSprite;
    readonly type = "animated";
    readonly imageUrl: BpxImageUrl;
    readonly size: BpxVector2d;
    private constructor();
    get current(): BpxSprite;
    pause(): void;
    resume(): void;
    restart(): void;
}

declare function timer_(frames: number, opts?: {
    loop?: boolean;
    pause?: boolean;
    delayFrames?: number;
}): BpxTimer;
declare class BpxTimer {
    #private;
    static for(params: {
        frames: number;
        loop: boolean;
        pause: boolean;
        delayFrames: number;
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

declare class AudioApi {
    #private;
    constructor(assets: Assets, audioContext: AudioContext);
    restart(): void;
    tryToResumeAudioContextSuspendedByBrowserForSecurityReasons(): Promise<boolean>;
    startPlayback(soundUrl: BpxSoundUrl, opts?: {
        muteOnStart?: boolean;
    }): BpxAudioPlaybackId;
    startPlaybackLooped(soundUrl: BpxSoundUrl, opts?: {
        muteOnStart?: boolean;
    }): BpxAudioPlaybackId;
    startPlaybackSequence(soundSequence: BpxSoundSequence, opts?: {
        muteOnStart?: boolean;
    }): BpxAudioPlaybackId;
    isAudioMuted(): boolean;
    muteAudio(opts?: {
        fadeOutMillis?: number;
    }): void;
    unmuteAudio(opts?: {
        fadeInMillis?: number;
    }): void;
    mutePlayback(playbackId: BpxAudioPlaybackId, opts?: {
        fadeOutMillis?: number;
    }): void;
    unmutePlayback(playbackId: BpxAudioPlaybackId, opts?: {
        fadeInMillis?: number;
    }): void;
    pauseAudio(): void;
    resumeAudio(): void;
    stopAllPlaybacks(opts?: {
        fadeOutMillis?: number;
    }): void;
    stopPlayback(playbackId: BpxAudioPlaybackId, opts?: {
        fadeOutMillis?: number;
    }): void;
    getAudioContext(): AudioContext;
    getGlobalGainNode(): GainNode;
}

declare class DebugMode {
    #private;
    static get enabled(): boolean;
    static set enabled(value: boolean);
    static get frameByFrame(): boolean;
    static toggleFrameByFrame(): void;
}

declare abstract class Canvas {
    #private;
    readonly canvasSize: BpxVector2d;
    protected constructor(canvasSize: BpxVector2d);
    /**
     * @returns - previous clipping region in form of an array: [xy, wh]
     */
    setClippingRegion(xy: BpxVector2d, wh: BpxVector2d): [BpxVector2d, BpxVector2d];
    /**
     * @returns - previous clipping region in form of an array: [xy, wh]
     */
    removeClippingRegion(): [BpxVector2d, BpxVector2d];
    canSetAny(xMin: number, yMin: number, xMax: number, yMax: number): boolean;
    canSetAt(x: number, y: number): boolean;
    abstract set(color: BpxRgbColor, x: number, y: number): void;
    takeSnapshot(): void;
    getMostRecentSnapshot(): CanvasSnapshot | null;
    protected abstract newSnapshot(): CanvasSnapshot;
    render(): void;
    protected abstract doRender(): void;
}

type DrawApiOptions = {
    canvas: Canvas;
    assets: Assets;
};
declare class DrawApi {
    #private;
    cameraXy: BpxVector2d;
    constructor(options: DrawApiOptions);
    clearCanvas(color: BpxRgbColor): void;
    setClippingRegion(xy: BpxVector2d, wh: BpxVector2d): [BpxVector2d, BpxVector2d];
    removeClippingRegion(): [BpxVector2d, BpxVector2d];
    setCameraXy(xy: BpxVector2d): BpxVector2d;
    setDrawingPattern(pattern: BpxDrawingPattern): BpxDrawingPattern;
    drawPixel(xy: BpxVector2d, color: BpxRgbColor): void;
    drawPixels(pixels: BpxPixels, xy: BpxVector2d, color: BpxRgbColor, opts?: {
        scaleXy?: BpxVector2d;
    }): void;
    drawLine(xy: BpxVector2d, wh: BpxVector2d, color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping): void;
    drawRect(xy: BpxVector2d, wh: BpxVector2d, color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping): void;
    drawRectFilled(xy: BpxVector2d, wh: BpxVector2d, color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping): void;
    drawEllipse(xy: BpxVector2d, wh: BpxVector2d, color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping): void;
    drawEllipseFilled(xy: BpxVector2d, wh: BpxVector2d, color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping): void;
    setSpriteColorMapping(spriteColorMapping: BpxSpriteColorMapping): BpxSpriteColorMapping;
    drawSprite(sprite: BpxSprite | BpxAnimatedSprite, xy: BpxVector2d, opts?: {
        centerXy?: [boolean, boolean];
        scaleXy?: BpxVector2d;
    }): void;
    setFont(fontId: BpxFontId): BpxFontId;
    getFont(): BpxFont;
    drawText(text: string, xy: BpxVector2d, color: BpxRgbColor | ((charSprite: BpxCharSprite) => BpxRgbColor), opts?: {
        centerXy?: [boolean, boolean];
        scaleXy?: BpxVector2d;
    }): void;
    takeCanvasSnapshot(): void;
}

type AssetsToLoad = {
    images?: ImageAssetToLoad[];
    fonts?: FontAssetToLoad[];
    sounds?: SoundAssetToLoad[];
    jsons?: JsonAssetToLoad[];
};
type ImageAssetToLoad = {
    url: BpxImageUrl;
};
type FontAssetToLoad = {
    font: BpxFont;
    spriteTextColor: BpxRgbColor | null;
};
type SoundAssetToLoad = {
    url: BpxSoundUrl;
};
type JsonAssetToLoad = {
    url: BpxJsonUrl;
};

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
declare abstract class FullScreen {
    #private;
    isFullScreenSupported(): boolean;
    abstract isInFullScreen(): boolean;
    static create(): FullScreen;
    abstract toggleFullScreen(): void;
}

type PersistedStateValueConstraints = Record<string, string | number | boolean | null>;
declare class StorageApi {
    #private;
    savePersistedState<PersistedStateValue extends PersistedStateValueConstraints>(value: PersistedStateValue): void;
    loadPersistedState<PersistedStateValue extends PersistedStateValueConstraints>(): PersistedStateValue | null;
    clearPersistedState(): void;
}

type EngineInitParams = {
    gameCanvasSize?: "64x64" | "128x128" | "256x256";
    fixedTimestep?: "30fps" | "60fps";
    debugMode?: boolean;
    assets?: AssetsToLoad;
};
type OnAssetsLoaded = {
    startGame: () => Promise<void>;
};
declare class Engine {
    #private;
    readonly gameInput: GameInput;
    readonly audioApi: AudioApi;
    readonly fullScreen: FullScreen;
    readonly storageApi: StorageApi;
    readonly assets: Assets;
    readonly drawApi: DrawApi;
    get frameNumber(): number;
    get renderingFps(): number;
    get detectedBrowserType(): BpxBrowserType;
    constructor(engineInitParams?: EngineInitParams);
    init(): Promise<OnAssetsLoaded>;
    setOnStarted(onStarted: () => void): void;
    setOnUpdate(onUpdate: () => void): void;
    setOnDraw(onDraw: () => void): void;
    restart(): void;
}

declare class Logger {
    #private;
    static debugBeetPx(...args: any[]): void;
    static debug(...args: any[]): void;
    static infoBeetPx(...args: any[]): void;
    static info(...args: any[]): void;
    static warnBeetPx(...args: any[]): void;
    static warn(...args: any[]): void;
    static errorBeetPx(...args: any[]): void;
    static error(...args: any[]): void;
}

declare class BeetPx {
    #private;
    static init(engineInitParams?: EngineInitParams): ReturnType<Engine["init"]>;
    static get debug(): typeof DebugMode.enabled;
    /**
     * Number of frames processed since game started.
     * It gets reset to 0 when `BeetPx.restart()` is called.
     * It counts update calls, not draw calls.
     *
     * @return number
     */
    static get frameNumber(): Engine["frameNumber"];
    static get renderingFps(): Engine["renderingFps"];
    static get detectedBrowserType(): Engine["detectedBrowserType"];
    static setOnStarted: Engine["setOnStarted"];
    static setOnUpdate: Engine["setOnUpdate"];
    static setOnDraw: Engine["setOnDraw"];
    static restart: Engine["restart"];
    static logDebug: typeof Logger.debug;
    static logInfo: typeof Logger.info;
    static logWarn: typeof Logger.warn;
    static logError: typeof Logger.error;
    static wasAnyButtonJustPressed: GameButtons["wasAnyJustPressed"];
    static wasButtonJustPressed: GameButtons["wasJustPressed"];
    static wasButtonJustReleased: GameButtons["wasJustReleased"];
    static isAnyButtonPressed: GameButtons["isAnyPressed"];
    static isButtonPressed: GameButtons["isPressed"];
    static getPressedDirection: GameButtons["getPressedDirection"];
    static setButtonRepeating: GameButtons["setRepeating"];
    static getRecentInputMethods: GameInput["getRecentInputMethods"];
    static getConnectedGamepadTypes: GameInput["getConnectedGamepadTypes"];
    static getEventsCapturedInLastUpdate: GameInput["getEventsCapturedInLastUpdate"];
    static clearCanvas: DrawApi["clearCanvas"];
    /**
     * @returns - previous clipping region in form of an array: [xy, wh]
     */
    static setClippingRegion: DrawApi["setClippingRegion"];
    /**
     * @returns - previous clipping region in form of an array: [xy, wh]
     */
    static removeClippingRegion: DrawApi["removeClippingRegion"];
    /**
     * Sets a new XY (left-top corner) of a camera's viewport
     *
     * @returns previous camera XY
     */
    static setCameraXy: DrawApi["setCameraXy"];
    /**
     * @returns previous pattern
     */
    static setDrawingPattern: DrawApi["setDrawingPattern"];
    static drawPixel: DrawApi["drawPixel"];
    /**
     * @param {BpxVector2d} xy - sd
     * @param {BpxRgbColor} color - sd
     * @param {string[]} bits - an array representing rows from top to bottom,
     *        where each array element is a text sequence of `0` and `1` to
     *        represent drawn and skipped pixels from left to right.
     */
    /**
     * Draws pixels based on a visual 2d representation in form of rows
     *   (designated by new lines) where `#` and `-` stand for a colored
     *   pixel and a lack of a pixel. Whitespaces are ignored.
     */
    static drawPixels: DrawApi["drawPixels"];
    static drawLine: DrawApi["drawLine"];
    static drawRect: DrawApi["drawRect"];
    static drawRectFilled: DrawApi["drawRectFilled"];
    static drawEllipse: DrawApi["drawEllipse"];
    static drawEllipseFilled: DrawApi["drawEllipseFilled"];
    /**
     * @returns previous sprite color mapping
     */
    static setSpriteColorMapping: DrawApi["setSpriteColorMapping"];
    static drawSprite: DrawApi["drawSprite"];
    static setFont: DrawApi["setFont"];
    static getFont: DrawApi["getFont"];
    static drawText: DrawApi["drawText"];
    static takeCanvasSnapshot: DrawApi["takeCanvasSnapshot"];
    static isAudioMuted: AudioApi["isAudioMuted"];
    static muteAudio: AudioApi["muteAudio"];
    static unmuteAudio: AudioApi["unmuteAudio"];
    static pauseAudio: AudioApi["pauseAudio"];
    static resumeAudio: AudioApi["resumeAudio"];
    static startPlayback: AudioApi["startPlayback"];
    static startPlaybackLooped: AudioApi["startPlaybackLooped"];
    static startPlaybackSequence: AudioApi["startPlaybackSequence"];
    static mutePlayback: AudioApi["mutePlayback"];
    static unmutePlayback: AudioApi["unmutePlayback"];
    static stopPlayback: AudioApi["stopPlayback"];
    static stopAllPlaybacks: AudioApi["stopAllPlaybacks"];
    static getAudioContext: AudioApi["getAudioContext"];
    static isFullScreenSupported: FullScreen["isFullScreenSupported"];
    static isInFullScreen: FullScreen["isInFullScreen"];
    static toggleFullScreen: FullScreen["toggleFullScreen"];
    static savePersistedState: StorageApi["savePersistedState"];
    static loadPersistedState: StorageApi["loadPersistedState"];
    static clearPersistedState: StorageApi["clearPersistedState"];
    static getImageAsset: Assets["getImageAsset"];
    static getFontAsset: Assets["getFontAsset"];
    static getSoundAsset: Assets["getSoundAsset"];
    static getJsonAsset: Assets["getJsonAsset"];
}
declare const b_: typeof BeetPx;

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
declare const rgb_p8_: typeof BpxPalettePico8;

declare global {
    /**
     * Note: the generated documentation marks this variable as "Not Exported".
     *   This is *not* true.
     *
     * @notExported
     */
    const BEETPX__IS_PROD: boolean;
    /**
     * Note: the generated documentation marks this variable as "Not Exported".
     *   This is *not* true.
     *
     * @notExported
     */
    const BEETPX__VERSION: string;
}

export { BeetPx, BpxAnimatedSprite, type BpxAudioPlaybackId, type BpxBrowserType, BpxCanvasSnapshotColorMapping, type BpxCharSprite, type BpxColorMapper, BpxDrawingPattern, BpxEasing, type BpxEasingFn, type BpxFont, type BpxFontAsset, type BpxFontId, BpxFontSaint11Minimal4, BpxFontSaint11Minimal5, type BpxGameButtonName, type BpxGameInputEvent, type BpxGamepadType, BpxGamepadTypeDetector, type BpxImageAsset, type BpxImageUrl, type BpxJsonAsset, type BpxJsonUrl, BpxPatternColors, BpxPixels, BpxRgbColor, type BpxRgbCssHex, type BpxSoundAsset, type BpxSoundSequence, type BpxSoundSequenceEntry, type BpxSoundUrl, BpxSprite, BpxSpriteColorMapping, BpxTimer, BpxUtils, BpxVector2d, aspr_, b_, rgb_, rgb_black_, rgb_blue_, rgb_cyan_, rgb_green_, rgb_magenta_, rgb_p8_, rgb_red_, rgb_white_, rgb_yellow_, spr_, timer_, u_, v_, v_0_0_, v_1_1_ };
