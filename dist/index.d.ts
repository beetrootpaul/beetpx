interface PrintDebug {
    __printDebug(): string;
}

declare function v_(x: number, y: number): BpxVector2d;
declare class BpxVector2d implements PrintDebug {
    static zero: BpxVector2d;
    static one: BpxVector2d;
    static min(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d;
    static max(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d;
    static minMax(xy1: BpxVector2d, xy2: BpxVector2d): [BpxVector2d, BpxVector2d];
    static lerp(xy1: BpxVector2d, xy2: BpxVector2d, t: number): BpxVector2d;
    /**
     * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    static unitFromAngle(turnAngle: number): BpxVector2d;
    static forEachIntXyWithinRectOf(xy: BpxVector2d, wh: BpxVector2d, roundValues: boolean, fill: boolean, callback: (xy: BpxVector2d) => void): void;
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    asArray(): [number, number];
    magnitude(): number;
    sign(): BpxVector2d;
    abs(): BpxVector2d;
    floor(): BpxVector2d;
    ceil(): BpxVector2d;
    round(): BpxVector2d;
    /**
     * "turn" – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    toAngle(): number;
    eq(other: BpxVector2d): boolean;
    eq(value: number): boolean;
    gt(other: BpxVector2d): boolean;
    gt(value: number): boolean;
    gte(other: BpxVector2d): boolean;
    gte(value: number): boolean;
    lt(other: BpxVector2d): boolean;
    lt(value: number): boolean;
    lte(other: BpxVector2d): boolean;
    lte(value: number): boolean;
    clamp(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d;
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
    __printDebug(): string;
}

type SpriteCreationHelper = (x1: number, y1: number, w: number, h: number) => BpxSprite;
declare function spr_(imageUrl: BpxImageUrl): SpriteCreationHelper;
declare class BpxSprite {
    imageUrl: BpxImageUrl;
    xy1: BpxVector2d;
    xy2: BpxVector2d;
    constructor(imageUrl: BpxImageUrl, xy1: BpxVector2d, xy2: BpxVector2d);
    size(): BpxVector2d;
}

type BpxCharSprite = {
    positionInText: BpxVector2d;
    sprite: BpxSprite;
    char: string;
};
type BpxFontId = string;
interface BpxFont {
    readonly id: BpxFontId;
    readonly imageUrl: BpxImageUrl;
    spritesFor(text: string): BpxCharSprite[];
}

declare class BpxFillPattern {
    #private;
    static of(bits: number): BpxFillPattern;
    static primaryOnly: BpxFillPattern;
    static secondaryOnly: BpxFillPattern;
    private constructor();
    hasPrimaryColorAt(xy: BpxVector2d): boolean;
}

type BpxColorMapping = Array<{
    from: BpxSolidColor;
    to: BpxSolidColor | BpxTransparentColor;
}>;
type BpxCanvasSnapshot = {
    canvasBytes: Uint8ClampedArray;
};
type DrawApiOptions = {
    canvasBytes: Uint8ClampedArray;
    canvasSize: BpxVector2d;
    assets: Assets;
};
declare class DrawApi {
    #private;
    readonly takeCanvasSnapshot: () => BpxCanvasSnapshot;
    constructor(options: DrawApiOptions);
    setCameraOffset(offset: BpxVector2d): void;
    setClippingRegion(xy: BpxVector2d, wh: BpxVector2d): void;
    removeClippingRegion(): void;
    setFillPattern(fillPattern: BpxFillPattern): void;
    mapSpriteColors(mapping: BpxColorMapping): BpxColorMapping;
    setFont(fontId: BpxFontId | null): void;
    getFont(): BpxFont | null;
    clearCanvas(color: BpxSolidColor): void;
    pixel(xy: BpxVector2d, color: BpxSolidColor): void;
    pixels(xy: BpxVector2d, color: BpxSolidColor, bits: string[]): void;
    line(xy: BpxVector2d, wh: BpxVector2d, color: BpxSolidColor | BpxCompositeColor | BpxMappingColor): void;
    rect(xy: BpxVector2d, wh: BpxVector2d, color: BpxSolidColor | BpxCompositeColor | BpxMappingColor): void;
    rectFilled(xy: BpxVector2d, wh: BpxVector2d, color: BpxSolidColor | BpxCompositeColor | BpxMappingColor): void;
    ellipse(xy: BpxVector2d, wh: BpxVector2d, color: BpxSolidColor | BpxCompositeColor | BpxMappingColor): void;
    ellipseFilled(xy: BpxVector2d, wh: BpxVector2d, color: BpxSolidColor | BpxCompositeColor | BpxMappingColor): void;
    sprite(sprite: BpxSprite, canvasXy: BpxVector2d, scaleXy?: BpxVector2d): void;
    print(text: string, canvasXy: BpxVector2d, color: BpxSolidColor | ((charSprite: BpxCharSprite) => BpxSolidColor), centerXy?: [boolean, boolean]): void;
}

type BpxColorId = string;
interface BpxColor {
    id: BpxColorId;
}
declare class BpxTransparentColor implements BpxColor {
    readonly id: BpxColorId;
}
declare const transparent_: BpxTransparentColor;
declare class BpxSolidColor implements BpxColor {
    readonly id: BpxColorId;
    readonly r: number;
    readonly g: number;
    readonly b: number;
    constructor(r: number, g: number, b: number);
    asRgbCssHex(): string;
    static fromRgbCssHex(cssHex: string): BpxSolidColor;
}
declare class BpxCompositeColor implements BpxColor {
    readonly id: BpxColorId;
    readonly primary: BpxSolidColor | BpxTransparentColor;
    readonly secondary: BpxSolidColor | BpxTransparentColor;
    constructor(primary: BpxSolidColor | BpxTransparentColor, secondary: BpxSolidColor | BpxTransparentColor);
}
declare class BpxMappingColor implements BpxColor {
    #private;
    readonly id: BpxColorId;
    readonly canvasSnapshot: BpxCanvasSnapshot;
    constructor(canvasSnapshot: BpxCanvasSnapshot, mapping: (canvasColor: BpxSolidColor | BpxTransparentColor) => BpxSolidColor | BpxTransparentColor);
    getMappedColorForCanvasIndex(r: number, g: number, b: number, a: number): BpxSolidColor | BpxTransparentColor;
}

type AssetsToLoad = {
    images: ImageAssetToLoad[];
    fonts: FontAssetToLoad[];
    sounds: SoundAssetToLoad[];
    jsons: JsonAssetToLoad[];
};
type BpxImageUrl = string;
type SoundUrl = string;
type JsonUrl = string;
type ImageAssetToLoad = {
    url: BpxImageUrl;
};
type FontAssetToLoad = {
    font: BpxFont;
    imageTextColor: BpxSolidColor;
    imageBgColor: BpxSolidColor;
};
type SoundAssetToLoad = {
    url: SoundUrl;
};
type JsonAssetToLoad = {
    url: JsonUrl;
};
type ImageAsset = {
    width: number;
    height: number;
    rgba8bitData: Uint8ClampedArray;
};
type FontAsset = {
    font: BpxFont;
    image: ImageAsset;
    imageTextColor: BpxSolidColor;
    imageBgColor: BpxSolidColor;
};
type SoundAsset = {
    audioBuffer: AudioBuffer;
};
type JsonAsset = {
    json: any;
};
declare class Assets {
    #private;
    constructor(params: {
        decodeAudioData: (arrayBuffer: ArrayBuffer) => Promise<AudioBuffer>;
    });
    loadAssets(assetsToLoad: AssetsToLoad): Promise<void>;
    getImageAsset(urlOfAlreadyLoadedImage: BpxImageUrl): ImageAsset;
    getFontAsset(fontId: BpxFontId): FontAsset;
    getSoundAsset(urlOfAlreadyLoadedSound: SoundUrl): SoundAsset;
    getJsonAsset(urlOfAlreadyLoadedJson: JsonUrl): JsonAsset;
}

type BpxEasingFn = (t: number) => number;
declare class BpxEasing {
    static linear: BpxEasingFn;
    static inQuadratic: BpxEasingFn;
    static outQuadratic: BpxEasingFn;
    static inQuartic: BpxEasingFn;
    static outQuartic: BpxEasingFn;
}

declare class BpxUtils {
    static booleanChangingEveryNthFrame(n: number): boolean;
    static clamp(a: number, b: number, c: number): number;
    static identity<Param>(param: Param): Param;
    static lerp(a: number, b: number, t: number): number;
    static measureText(text: string): BpxVector2d;
    static noop(): void;
    static offset8Directions(): BpxVector2d[];
    static printWithOutline(text: string, canvasXy1: BpxVector2d, textColor: BpxSolidColor, outlineColor: BpxSolidColor, centerXy?: [boolean, boolean]): void;
    static randomElementOf<V>(array: V[]): V | undefined;
    static range(n: number): number[];
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
declare const u_: typeof BpxUtils;

type BpxSoundSequence = {
    sequence?: SoundSequenceEntry[];
    sequenceLooped?: SoundSequenceEntry[];
};
type SoundSequenceEntry = [
    SoundSequenceEntrySoundMain,
    ...SoundSequenceEntrySoundAdditional[]
];
type SoundSequenceEntrySoundMain = {
    url: SoundUrl;
    durationMs?: (fullSoundDurationMs: number) => number;
};
type SoundSequenceEntrySoundAdditional = {
    url: SoundUrl;
};

type BpxAudioPlaybackId = number;
declare class AudioApi {
    #private;
    get audioContext(): AudioContext;
    get globalGainNode(): GainNode;
    constructor(assets: Assets, audioContext: AudioContext);
    resumeAudioContextIfNeeded(): void;
    toggleMuteUnmute(): void;
    stopAllSounds(): void;
    stopSound(playbackId: BpxAudioPlaybackId): void;
    playSoundOnce(soundUrl: SoundUrl): BpxAudioPlaybackId;
    playSoundLooped(soundUrl: SoundUrl, muteOnStart?: boolean): BpxAudioPlaybackId;
    playSoundSequence(soundSequence: BpxSoundSequence): BpxAudioPlaybackId;
    muteSound(playbackId: BpxAudioPlaybackId): void;
    unmuteSound(playbackId: BpxAudioPlaybackId): void;
}

declare class BpxClippingRegion {
    #private;
    constructor(xy: BpxVector2d, wh: BpxVector2d);
    allowsDrawingAt(xy: BpxVector2d): boolean;
}

declare class Button {
    #private;
    static readonly repeatingFramesStart = 30;
    static readonly repeatingFramesInterval = 8;
    get isPressed(): boolean;
    wasJustPressed(repeating: boolean): boolean;
    wasJustReleased(repeating: boolean): boolean;
    update(isPressed: boolean): void;
}

type BpxGameInputEvent = null | "button_left" | "button_right" | "button_up" | "button_down" | "button_x" | "button_o" | "button_menu" | "mute_unmute_toggle" | "full_screen" | "debug_toggle" | "frame_by_frame_toggle" | "frame_by_frame_step";
declare class GameInput {
    #private;
    readonly gameButtons: Buttons;
    readonly buttonFullScreen: Button;
    readonly buttonMuteUnmute: Button;
    readonly buttonDebugToggle: Button;
    readonly buttonFrameByFrameToggle: Button;
    readonly buttonFrameByFrameStep: Button;
    constructor(params: {
        visibleTouchButtons: BpxButtonName[];
        muteButtonsSelector: string;
        fullScreenButtonsSelector: string;
        enableDebugInputs: boolean;
    });
    startListening(): void;
    update(params: {
        skipGameButtons: boolean;
    }): void;
    wasAnyButtonPressed(): boolean;
}

type BpxButtonName = "left" | "right" | "up" | "down" | "o" | "x" | "menu";
declare class Buttons {
    #private;
    update(events: Set<BpxGameInputEvent>): void;
    isPressed(button: BpxButtonName): boolean;
    setRepeating(button: BpxButtonName, repeating: boolean): void;
    wasAnyJustPressed(): boolean;
    wasJustPressed(button: BpxButtonName): boolean;
    wasJustReleased(button: BpxButtonName): boolean;
}

declare function timer_(frames: number): BpxTimer;
declare class BpxTimer {
    #private;
    constructor(params: {
        frames: number;
    });
    get framesLeft(): number;
    get progress(): number;
    get hasFinished(): boolean;
    update(): void;
    restart(): void;
}

declare class DebugMode {
    #private;
    static get enabled(): boolean;
    static set enabled(value: boolean);
}

type StorageApiValueConstraint = Record<string, string | number | boolean | null>;
declare class StorageApi {
    #private;
    store<StorageApiValue extends StorageApiValueConstraint>(value: StorageApiValue): void;
    load<StorageApiValue extends StorageApiValueConstraint>(): StorageApiValue | null;
    clearStorage(): void;
}

type FrameworkOptions = {
    gameCanvasSize: "64x64" | "128x128";
    desiredUpdateFps: 30 | 60;
    visibleTouchButtons: BpxButtonName[];
    debugFeatures: boolean;
};
type OnAssetsLoaded = {
    startGame: () => void;
};
declare class Framework {
    #private;
    readonly gameInput: GameInput;
    readonly audioApi: AudioApi;
    readonly storageApi: StorageApi;
    readonly assets: Assets;
    readonly drawApi: DrawApi;
    get frameNumber(): number;
    get renderFps(): number;
    constructor(options: FrameworkOptions);
    loadAssets(assetsToLoad: AssetsToLoad): Promise<OnAssetsLoaded>;
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
    static init(frameworkOptions: FrameworkOptions, assetsToLoad: AssetsToLoad): ReturnType<Framework["loadAssets"]>;
    static get debug(): typeof DebugMode.enabled;
    /**
     * Number of frames processed since game started.
     * It gets reset to 0 when `BeetPx.restart()` is called.
     * It counts update calls, not draw calls.
     */
    static get frameNumber(): Framework["frameNumber"];
    static get renderFps(): Framework["renderFps"];
    static get audioContext(): AudioApi["audioContext"];
    static get globalGainNode(): AudioApi["globalGainNode"];
    static setOnStarted: Framework["setOnStarted"];
    static setOnUpdate: Framework["setOnUpdate"];
    static setOnDraw: Framework["setOnDraw"];
    static restart: Framework["restart"];
    static logDebug: typeof Logger.debug;
    static logInfo: typeof Logger.info;
    static logWarn: typeof Logger.warn;
    static logError: typeof Logger.error;
    static isPressed: Buttons["isPressed"];
    static setRepeating: Buttons["setRepeating"];
    static wasJustPressed: Buttons["wasJustPressed"];
    static wasJustReleased: Buttons["wasJustReleased"];
    static setCameraOffset: DrawApi["setCameraOffset"];
    static setClippingRegion: DrawApi["setClippingRegion"];
    static removeClippingRegion: DrawApi["removeClippingRegion"];
    static setFillPattern: DrawApi["setFillPattern"];
    static mapSpriteColors: DrawApi["mapSpriteColors"];
    static setFont: DrawApi["setFont"];
    static getFont: DrawApi["getFont"];
    static clearCanvas: DrawApi["clearCanvas"];
    static pixel: DrawApi["pixel"];
    static pixels: DrawApi["pixels"];
    static line: DrawApi["line"];
    static rect: DrawApi["rect"];
    static rectFilled: DrawApi["rectFilled"];
    static ellipse: DrawApi["ellipse"];
    static ellipseFilled: DrawApi["ellipseFilled"];
    static sprite: DrawApi["sprite"];
    static print: DrawApi["print"];
    static takeCanvasSnapshot: DrawApi["takeCanvasSnapshot"];
    static toggleMuteUnmute: AudioApi["toggleMuteUnmute"];
    static playSoundOnce: AudioApi["playSoundOnce"];
    static playSoundLooped: AudioApi["playSoundLooped"];
    static playSoundSequence: AudioApi["playSoundSequence"];
    static stopAllSounds: AudioApi["stopAllSounds"];
    static stopSound: AudioApi["stopSound"];
    static muteSound: AudioApi["muteSound"];
    static unmuteSound: AudioApi["unmuteSound"];
    static store: StorageApi["store"];
    static load: StorageApi["load"];
    static clearStorage: StorageApi["clearStorage"];
    static getImageAsset: Assets["getImageAsset"];
    static getFontAsset: Assets["getFontAsset"];
    static getSoundAsset: Assets["getSoundAsset"];
    static getJsonAsset: Assets["getJsonAsset"];
}
declare const b_: typeof BeetPx;

declare global {
    /**
     * A globally available variable which tells whether you are using
     *   a production bundle of the game (built with `beetpx prod`)
     *   or not (e.g. run with `beetpx dev`).
     *
     * Note: the generated documentation marks this variable as "Not Exported".
     *   This is *not* true.
     *
     * @notExported
     */
    const __BEETPX_IS_PROD__: boolean;
}

export { BeetPx, BpxAudioPlaybackId, BpxButtonName, BpxCanvasSnapshot, BpxCharSprite, BpxClippingRegion, BpxColor, BpxColorId, BpxColorMapping, BpxCompositeColor, BpxEasing, BpxEasingFn, BpxFillPattern, BpxFont, BpxFontId, BpxGameInputEvent, BpxImageUrl, BpxMappingColor, BpxSolidColor, BpxSoundSequence, BpxSprite, BpxTimer, BpxTransparentColor, BpxUtils, BpxVector2d, b_, spr_, timer_, transparent_, u_, v_ };
